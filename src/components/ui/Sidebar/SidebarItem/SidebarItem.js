import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

function SidebarItem({ icon, text, path, isExpanded }) {
    const location = useLocation();
    const isActive = useMemo(() => {
        if (Array.isArray(path)) {
            return path.some((p) => location.pathname === p);
        }
        return location.pathname === path;
    }, [location.pathname, path]);

    return (
        <li className={`item center${isActive ? ' active' : ''}`}>
            <Link to={Array.isArray(path) ? path[1] : path}>
                {icon}
                <span className={`item-text${isExpanded ? ' expand' : ''}`}>{text}</span>
            </Link>
            {!isExpanded && (
                <div className="tooltip">
                    <span className="tooltip-text">{text}</span>
                </div>
            )}
        </li>
    );
}

export default SidebarItem;
