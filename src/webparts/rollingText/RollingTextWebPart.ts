import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

// SPHttpClient not required in the web part file; list picker uses context internally

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
  lists: string | string []; // Stores the list ID(s)
  listContent: string;
  item: any;
  Speed: number;
  Direction: string;
  Delay: number;
  Loop: boolean;              
  textFieldInternalName: string;   // chosen text field
  speedSeconds: number;             // CSS animation duration
  direction: 'up' | 'down';
  pauseOnHover: boolean; // Whether to pause the animation on hover
  listId: any;   // chosen list
  listTitle: string;
  selectedList?: string;
}

export default class RollingTextWebPart extends BaseClientSideWebPart<IRollingTextWebPartProps> {
  _lists: any;
  listId: any;
  listTitle: any;

  public async render(): Promise <void> {
      const element: React.ReactElement<IRollingTextProps> = React.createElement(
      RollingText,
      {
        description: this.properties.description,
        listContent: this.properties.listContent,
        listTitle: this.properties.listTitle, // Ensure this matches IRollingTextProps
        Text: this.properties.Text || '',
        Speed: this.properties.Speed || 1,
        Direction: this.properties.Direction || 'left',
        Delay: this.properties.Delay || 0,
        Loop: this.properties.Loop || false,
        lists: this.properties.lists,
        listId: this.properties.listId,
        context: this.context,
        items: this.properties.items || [], // Provide actual items if available
        selectedList: this.properties.selectedList || '', // Provide actual selectedList if available
        speedSeconds: this.properties.speedSeconds || 1, // Provide actual speedSeconds if available
        pauseOnHover: this.properties.pauseOnHover || false // Provide actual pauseOnHover if available
      }
    );
    ReactDom.render(element, this.domElement);
  }

  public async onInit(): Promise<void> {
    // No manual list fetch required here: PropertyFieldListPicker will query lists using the provided context.
    // Keep onInit for any future initialization; nothing to do now.
    return Promise.resolve();
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
                PropertyPaneTextField('listTitle', {
                  label: 'List Title'
                }),
                PropertyFieldListPicker('listId', {
                  label: 'Select a list',
                  selectedList: this.properties.listId,
                  includeHidden: false,
                  orderBy: PropertyFieldListPickerOrderBy.Title,
                  disabled: false,
                  onPropertyChange: this.onPropertyPaneFieldChanged.bind(this),
                  properties: this.properties,
                  context: this.context,
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
