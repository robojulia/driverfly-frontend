import { ReactChild } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import { useTranslation } from "../../../hooks/useTranslation";

export interface TabbedLayoutProps {
    id?: string;
    className?: string;
    items: {[title: string]: (TabbedLayoutItem|ReactChild)}
}
export interface TabbedLayoutItem {
    id?: string;
    title?: string;
    hidden?: boolean|((key: string, value: TabbedLayoutItem) => boolean);
    panelClassName?: string;
    headerClassName?: string;
    item: ReactChild;
}

function isTabbedLayoutItem(value: any): value is TabbedLayoutItem {
    return value && value.item;
}

export function TabbedLayout(props: TabbedLayoutProps) {
    const { t } = useTranslation();

    const { id, className, items } = props;

    const tabs: TabbedLayoutItem[] = Object
        .entries(items)
        .map(([key, value]) => {
            if (isTabbedLayoutItem(value)) return {
                ...value,
                hidden: typeof value.hidden === "function" ? value.hidden(value.id, value) : value.hidden,
                id: value.id || key,
                title: t(value.title || key)
            } as TabbedLayoutItem;

            return {
                id: key,
                title: t(key),
                item: value
            } as TabbedLayoutItem;
        })
        // .filter(value => !!value.hidden);
    
    console.log(items);
    console.log(tabs);

    return (
        <Tabs id={id} className={className}>
            <TabList>
                {tabs.map(tab =>
                    (<Tab key={tab.id}>{tab.title}</Tab>)
                )}
            </TabList>
            {tabs.map(tab => (
                <TabPanel key={tab.id} className={tab.panelClassName}>
                    {tab.item}
                </TabPanel>
            ))}
        </Tabs>
    );

}