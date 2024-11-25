import { useState } from 'react';
import './Tabs.scss';

function Tabs({ tabs }) {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (index) => {
        setActiveTab(index);
    };
    return (
        <div className="tabs-wrapper">
            <div className="tabs-header">
                {tabs.map((tab, index) => (
                    <button key={index} onClick={() => handleTabChange(index)} className={`tab ${activeTab === index ? 'active' : ''}`}>
                        {tab.label}
                    </button>
                ))}
            </div>
            <div className="tabs-content">{tabs[activeTab].content}</div>
        </div>
    );
}

export default Tabs;

// function TabsCompoExample() {
//     console.log('TabsCompoExample');

//     // Tabs
//     const tabs = [
//         { label: 'Tab 1', content: <div>Tab content 1</div> },
//         { label: 'Tab 2', content: <div>Tab content 2</div> },
//     ];
//     return <Tabs tabs={tabs} />;
// }

// export default TabsCompoExample;
