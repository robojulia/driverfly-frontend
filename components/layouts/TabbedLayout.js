import { ReactChild } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { useTranslation } from "../../hooks/useTranslation";

/**
 * @typedef TabbedLayoutProps
 * @property {string} id
 * @property {string} className additional classname to apply to container
 * @property {{[title: string]: (TabbedLayoutItem|ReactChild)}} items
 */

/**
 * @typedef TabbedLayoutItem
 * @property {string} title defaults to key name
 * @property {boolean|(key: string, value: TabbledLayoutItem) => boolean} hidden defaults to false
 * @property {string} panelClassName additional classname to apply to Tab Content
 * @property {string} headerClassName additional classname to apply to Tab Header
 * @property {ReactChild} item
 */

/**
 * 
 * @param {TabbedLayoutProps} props 
 */
export function TabbedLayout(props) {
    const { t } = useTranslation();

    const { id, className, items } = props;

    const tabs = Object
        .entries(items)
        .filter(([key, value]) => {
            if (!value.item) return true;

            if (typeof value.hidden === "function")
                value.hidden = value.hidden(key, value);

            if (!!value.hidden) return false;

            if (!value.title || typeof value.title === "string") value.title = t(value.title || key);

            return true;
        });

    return (
        <Tabs id={id} className={className}>
            <TabList>
                {tabs.map(([key, value]) =>
                    (<Tab key={key}>{value.title || t(key)}</Tab>)
                )}
            </TabList>
            {tabs.map(([key, value]) => (
                <TabPanel key={key} className={value.panelClassName}>
                    {value.item || value}
                </TabPanel>
            ))}
        </Tabs>
    );

}