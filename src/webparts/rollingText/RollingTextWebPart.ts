import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import { SPHttpClient } from '@microsoft/sp-http';

import * as strings from 'RollingTextWebPartStrings';
import RollingText from './components/RollingText';
import { IRollingTextProps } from "./components/IRollingTextProps";
import { PropertyFieldListPicker, PropertyFieldListPickerOrderBy } from '@pnp/spfx-property-controls/lib/PropertyFieldListPicker';

export interface IPropertyControlsTestWebPartProps {
  lists: string | string[]; // Stores the list ID(s)
}
export interface IRollingTextWebPartProps {
  [x: string]: any;
  description: string;
  listName: string;
  lists: string | string[]; // Stores the list ID(s)
  listContent: string;
}

export default class RollingTextWebPart extends BaseClientSideWebPart<IRollingTextWebPartProps> {
  _lists: any;

  public render(): void {
    const element: React.ReactElement<IRollingTextProps> = React.createElement(
      RollingText,
      {
        description: this.properties.description,
        listContent: this.properties.listContent,
        listName: this.properties.listName,
        context: this.context,
        lists: this.properties.lists,
        listId: this.properties.listId,
        Text: this.properties.Text || '', // Replace with actual value if available
        Speed: this.properties.Speed || 1, // Replace with actual value if available
        Direction: this.properties.Direction || 'left', // Replace with actual value if available
        Delay: this.properties.Delay || 0, // Replace with actual value if available
        Loop: this.properties.Loop || false, // Replace with actual value if available
        // hasTeamsContext: false, // Provide actual value if available
        items: [], // Provide actual items if available
        item: '' // Provide actual item if available
      }
    );
    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {
    const response = await this.context.spHttpClient.get(`https://graph.microsoft.com/v1.0/sites/${this.context.pageContext.web.absoluteUrl}/lists?$filter`, SPHttpClient.configurations.v1);
    const data = await response.json();
    if(data && data.value) {  
    this._lists = data.value.map((list: any) => ({
      key: list.Title, 
      text: list.Title,
      listName: list.listName,
      listId: list.id,
    }));
  } else {
    console.warn('No lists found or data is not in expected format', data);
  }
} 

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('List Title', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyFieldListPicker('lists', {
                label: 'Select a list',
                selectedList: this.properties.lists,
                includeHidden: false,
                orderBy: PropertyFieldListPickerOrderBy.Title,
                disabled: false,
                onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                properties: this.properties,
                context: this.properties.context,
                onGetErrorMessage: undefined,
                deferredValidationTime: 0,
                key: 'listPickerFieldId'
              })
              ]
            }
          ]
        }
      ]
    };
  }
}
