import * as React from 'react';
import {useEffect, useState} from 'react';
import { SPHttpClient } from '@microsoft/sp-http';
import styles from './RollingText.module.scss';
import type { IRollingTextProps } from "./IRollingTextProps";

const RollingText: React.FC<IRollingTextProps> = (props) => {
  const [items, setItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchListItems = async () => {
      try {
        const response = await props.context.spHttpClient.get(
          `https://graph.microsoft.com/v1.0/sites/${props.context.pageContext.web.absoluteUrl}/lists/${props.listId}/items`,
          SPHttpClient.configurations.v1
        );
        const data = await response.json();
        const items = data.value.map((item: any) => item.fields[props.listContent]);
        setItems(items);
      } catch (error) {
        console.error('Error fetching list items:', error);
      }
    }
    fetchListItems();
  }, [props.listId, props.listContent, props.context]);
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
