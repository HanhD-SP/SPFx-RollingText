import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import styles from './RollingText.module.scss';
import type { IRollingTextProps } from './IRollingTextProps';

const RollingText: React.FC<IRollingTextProps> = (props) => {
  const [items, setItems] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Fetch list items using SPHttpClient
  useEffect(() => {
    if (!props.listId || !props.context) {
      setItems([]);
      return;
    }

    const fetchItems = async () => {
      try {
        if (!props.listId) {
          setItems([]);
          return;
        }

        // Handle listId - it should be a GUID from PropertyFieldListPicker
        let listIdStr = String(props.listId).trim();
        // Remove curly braces if present, but keep the GUID format
        listIdStr = listIdStr.replace(/[{}]/g, '');
        
        const field = props.listContent || 'Title';
        
        if (!listIdStr || listIdStr.length === 0) {
          console.error('Invalid list ID: listId is empty');
          setItems([]);
          return;
        }
        
        // Validate GUID format (should be 32 hex characters, optionally with hyphens)
        const guidPattern = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
        const isValidGuid = guidPattern.test(listIdStr);
        
        // Encode field name for URL to handle special characters
        const encodedField = encodeURIComponent(field);
        
        // Use relative URL - SPHttpClient handles authentication, base URL, and CORS automatically
        // SPHttpClient.configurations.v1 already includes proper Accept headers
        // Removing custom headers to avoid 406 errors - let SPHttpClient handle headers automatically
        
        let apiUrl: string;
        let response: SPHttpClientResponse;
        
        // Try with GUID format first if it looks like a GUID
        if (isValidGuid) {
          apiUrl = `/_api/web/lists(guid'${listIdStr}')/items?$select=${encodedField}&$top=100`;
          response = await props.context.spHttpClient.get(
            apiUrl,
            SPHttpClient.configurations.v1
          );
        } else {
          // If not a valid GUID, try as list title
          apiUrl = `/_api/web/lists/getbytitle('${encodeURIComponent(listIdStr)}')/items?$select=${encodedField}&$top=100`;
          response = await props.context.spHttpClient.get(
            apiUrl,
            SPHttpClient.configurations.v1
          );
        }

        // If GUID format fails, try using the list ID as a string (in case it's a list title)
        if (!response.ok && isValidGuid && (response.status === 406 || response.status === 404 || response.status === 400)) {
          console.log('GUID format failed, trying list title format');
          apiUrl = `/_api/web/lists/getbytitle('${encodeURIComponent(listIdStr)}')/items?$select=${encodedField}&$top=100`;
          response = await props.context.spHttpClient.get(
            apiUrl,
            SPHttpClient.configurations.v1
          );
        }

        if (!response.ok) {
          let errorText = '';
          try {
            errorText = await response.text();
          } catch (e) {
            // Ignore error reading response
          }
          console.error(`Failed to fetch items: ${response.status} ${response.statusText}`, errorText);
          setItems([]);
          return;
        }

        const json = await response.json();
        // Handle odata=verbose format (d.results)
        const itemsArray = json.d?.results || json.value || [];
        const fetchedItems = itemsArray
          .map((item: any) => {
            const value = item[field] || '';
            return String(value).trim();
          })
          .filter((item: string) => item.length > 0);
        
        setItems(fetchedItems);
      } catch (error) {
        console.error('Error fetching list items:', error);
        setItems([]);
      }
    };

    fetchItems();
  }, [props.listId, props.listContent, props.context]);

  // Calculate animation duration based on content width
  useEffect(() => {
    const content = contentRef.current;
    if (!content || items.length === 0) return;

    const updateAnimation = () => {
      const firstRepetition = content?.firstElementChild as HTMLElement;
      if (!firstRepetition) {
        setTimeout(updateAnimation, 50);
        return;
      }

      const contentWidth = firstRepetition.getBoundingClientRect().width;
      if (contentWidth > 0) {
        const speedSeconds = props.speedSeconds > 0 ? props.speedSeconds : 8;
        const duration = speedSeconds * 1000; // Convert to milliseconds
        content.style.animationDuration = `${duration}ms`;
      }
    };

    // Wait for DOM to be ready
    setTimeout(updateAnimation, 100);
  }, [items, props.speedSeconds]);

  const textColor = props.textColor || '#000000';

  const containerClass = `${styles.rollingText} ${props.pauseOnHover ? styles.pauseOnHover : ''}`;

  return (
    <div className={containerClass} ref={containerRef} style={{ overflow: 'hidden', width: '100%' }}>
      <div
        className={`${styles.container} ${styles.track}`}
        ref={contentRef}
        style={{ display: 'inline-flex', whiteSpace: 'nowrap' }}
      >
        {[0, 1].map((rep) => (
          <div key={rep} className={styles.group} aria-hidden={rep === 1}>
            {items.map((item, i) => (
              <span key={`${rep}-${i}`} className={styles.item} style={{ color: textColor }}>
                {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default RollingText;