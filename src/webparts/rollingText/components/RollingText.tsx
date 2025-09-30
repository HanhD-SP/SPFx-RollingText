import * as React from 'react';
import {useEffect, useState} from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './RollingText.module.scss';
import type { IRollingTextProps } from "./IRollingTextProps";

// RollingText component
// Props of interest:
// - props.listId: GUID of the selected SharePoint list (from the property pane list picker)
// - props.listContent: internal field name to read from list items (e.g., 'Title' or a custom field's internal name)
// - props.context: the web part context required for SPHttpClient requests
const RollingText: React.FC<IRollingTextProps> = (props) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchListItems = async () => {
      try {
        // If no list is selected, show nothing. This avoids querying the root site.
        if(!props.listId) {
          setItems([]);
          return;
        }

        // Use the REST API endpoint getbyId to avoid ambiguity between lists with the same title.
        // listId should be a GUID string; remove surrounding braces if present.
        const webUrl = props.context.pageContext.web.absoluteUrl;
        const listId = encodeURIComponent(props.listId.replace(/\{|\}/g, ''));
        // listContent should be the internal field name to display (e.g., 'Title'). Default to Title.
        const field = props.listContent || 'Title';

        // Request only the field we need to reduce payload size.
        const url = `${webUrl}/_api/web/lists(guid'${listId}')/items?$select=Id,${field}`;

        const response = await props.context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
          { headers: { Accept: 'application/json;odata=nometadata' } }
        );

        if(!response.ok) {
          // Surface non-200 responses to console for easier debugging during development.
          console.error('List items response not ok', response.status, response.statusText);
          setItems([]);
          return;
        }

        const data = await response.json();
        // Map each item to the requested field (coerce to string and trim whitespace).
        const items = (data.value || []).map((item: any) => (item[field] ?? '').toString());
        setItems(items.map((i: string) => i.trim()));
      } catch (error) {
        // Log and keep the component resilient if the network call fails.
        console.error('Error fetching list items:', error);
      }
    }
    fetchListItems();
  }, [props.listId, props.listTitle, props.listContent, props.context]);
  // const { Speed, Direction, Delay, Loop } = props; 

  return (
    <div className={`${styles.rollingText}`}>
      <div className={styles.container}>
        {items.map((item, index) => (
          <span key={index}>{item.trim()}</span>
        ))}
      </div>
    </div>
  );
};

export default RollingText;