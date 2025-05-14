import * as React from 'react';
import styles from './RollingText.module.scss';
import type { IRollingTextProps } from './IRollingTextProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class RollingText extends React.Component<IRollingTextProps> {
  public render(): React.ReactElement<IRollingTextProps> {
    const {
      description,
      isDarkTheme,
      environmentMessage,
      hasTeamsContext,
      userDisplayName
    } = this.props;

    return (
      <section className={`${styles.rollingText} ${hasTeamsContext ? styles.teams : ''}`}>
        <div className={styles.welcome}>

        </div>
      </section>
    );
  }
}
