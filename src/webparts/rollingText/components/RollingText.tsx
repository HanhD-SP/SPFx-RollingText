import * as React from 'react';
import {useEffect, useState} from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './RollingText.module.scss';
import type { IRollingTextProps } from "./IRollingTextProps";

const RollingText: React.FC<IRollingTextProps> = (props) => {
  const [items, setItems] = useState<string[]>([]);

  // useEffect(() => {
  // const fetchListItems = async () => {
  //   try {
  //     const webUrl = props.context.pageContext.web.absoluteUrl;
  //     const listId = encodeURIComponent(props.listId || "");
  //     const field = props.listContent; // e.g., "Title"

  //     // Select only what you need to avoid large payloads
  //     const url =
  //       `${webUrl}/_api/web/lists/getbyId('${listId}')/items` +
  //       `?$select=Id,Title,${field}`;

  //     const response = await props.context.spHttpClient.get(
  //       url,
  //       SPHttpClient.configurations.v1,
  //       { headers: { Accept: "application/json;odata=nometadata" } }
  //     );

  //     if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);

  //     const data = await response.json();
  //     const items = (data.value || []).map((item: any) => (item[field] as string) ?? "");
  //     setItems(items);
  //   } catch (error) {
  //     console.error("Error fetching list items:", error);
  //     setItems([]); // optional fallback
  //   }
  // };

  // if (props.listId && props.listContent) {
  //   fetchListItems();
  // }
  // // re-run when Title/content change
  // }, [props.listId, props.listContent, props.context]);


  useEffect(() => {
    const fetchListItems = async () => {
      try {
        if(!props.listId) {
          setItems([]);
          return;
        }

        const webUrl = props.context.pageContext.web.absoluteUrl;
        const listId = encodeURIComponent(props.listId.replace(/\{|\}/g, ''));
        const field = props.listContent || 'Title';

        const url = `${webUrl}/_api/web/lists(guid'${listId}')/items?$select=Id,${field}`;

        const response = await props.context.spHttpClient.get(
          url,
          SPHttpClient.configurations.v1,
          { headers: { Accept: 'application/json;odata=nometadata' } }
        );

        if(!response.ok) {
          console.error('List items response not ok', response.status, response.statusText);
          setItems([]);
          return;
        }

        const data = await response.json();
        const items = (data.value || []).map((item: any) => (item[field] ?? '').toString());
        setItems(items.map((i: string) => i.trim()));
      } catch (error) {
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