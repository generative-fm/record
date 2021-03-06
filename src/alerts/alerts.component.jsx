import React, { useState, useCallback, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import { CSSTransition } from 'react-transition-group';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Notifications as BellIcon,
  Clear as ClearIcon,
  OpenInNew as OpenInNewIcon,
} from '@material-ui/icons';
import selectAlerts from './alerts.selector';
import userViewedAlerts from './actions/user-viewed-alerts.creator';
import pluck from '../utilities/pluck';
import useDismissable from '../common/use-dismissable.hook';
import './alerts.styles.scss';

const alertComparator = (a, b) => {
  if (a.isLoud === b.isLoud) {
    return a.timestamp - b.timestamp;
  } else if (a.isLoud) {
    return 1;
  }
  // b.isLoud
  return -1;
};

const AlertItem = ({
  id,
  description,
  url,
  callToAction,
  isLoud,
  isExternal,
  isOpen,
  delay,
}) => {
  return (
    <CSSTransition
      key={id}
      in={isOpen}
      classNames="alerts__messages__item-"
      timeout={200 + delay}
      unmountOnExit
    >
      <div
        className={`alerts__messages__item${
          isLoud ? ' alerts__messages__item--is-loud' : ''
        }`}
        style={{ transitionDelay: `${delay}ms` }}
      >
        <div className="alerts__messages__item__description">{description}</div>
        {isExternal ? (
          <a
            className="alerts__messages__item__call-to-action"
            href={url}
            target="_blank"
            rel="noreferrer noopener"
          >
            {callToAction} {isExternal && <OpenInNewIcon />}
          </a>
        ) : (
          <Link className="alerts__messages__item__call-to-action" to={url}>
            {callToAction}
          </Link>
        )}
      </div>
    </CSSTransition>
  );
};

AlertItem.propTypes = {
  id: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  callToAction: PropTypes.string.isRequired,
  isLoud: PropTypes.bool.isRequired,
  isExternal: PropTypes.bool.isRequired,
  isOpen: PropTypes.bool.isRequired,
  delay: PropTypes.number.isRequired,
};

const Alerts = ({ shouldAdjustForFooter = false }) => {
  const containerRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const alerts = useSelector(selectAlerts);
  const sortedAlerts = useMemo(
    () => Object.values(alerts).sort(alertComparator),
    [alerts]
  );
  const visibleAlerts = sortedAlerts.slice(-5);
  const dispatch = useDispatch();
  const handleButtonClick = useCallback(() => {
    setIsOpen((previousValue) => !previousValue);
    const newlyReadAlertIds = visibleAlerts
      .filter(pluck('isUnread'))
      .map(pluck('id'));
    if (newlyReadAlertIds.length > 0) {
      dispatch(userViewedAlerts(newlyReadAlertIds));
    }
  }, [setIsOpen, dispatch, visibleAlerts]);

  const handleDismiss = useCallback(() => {
    setIsOpen(false);
  }, []);

  useDismissable({
    isOpen,
    dismissableRef: containerRef,
    onDismiss: handleDismiss,
  });

  const hasUnread = Object.values(alerts).some(pluck('isUnread'));
  const hasLoudUnread =
    hasUnread &&
    Object.values(alerts).filter(pluck('isUnread')).some(pluck('isLoud'));

  return (
    <div
      className={`alerts${
        shouldAdjustForFooter ? ' alerts--above-footer' : ''
      }`}
      ref={containerRef}
    >
      <div className="alerts__messages">
        {visibleAlerts.map((alert, i) => {
          const timingMultiplier = isOpen ? visibleAlerts.length - i - 1 : i;
          const delay = timingMultiplier * 50;
          return (
            <AlertItem
              key={alert.id}
              isOpen={isOpen}
              delay={delay}
              {...alert}
            />
          );
        })}
        {visibleAlerts.length === 0 && (
          <CSSTransition
            in={isOpen}
            classNames="alerts__messages__item-"
            timeout={200}
            unmountOnExit
          >
            <div
              className="alerts__messages__item"
              style={{ transitionDelay: `${200}ms` }}
            >
              <div className="alerts__messages__item__description">
                No alerts
              </div>
            </div>
          </CSSTransition>
        )}
      </div>
      <button
        className={`alerts__button${
          hasUnread && !isOpen ? ' alerts__button--has-dot' : ''
        }${hasLoudUnread && !isOpen ? ' alerts__button--is-loud' : ''}`}
        onClick={handleButtonClick}
      >
        {isOpen ? <ClearIcon /> : <BellIcon />}
      </button>
    </div>
  );
};

Alerts.propTypes = {
  shouldAdjustForFooter: PropTypes.bool,
};

export default Alerts;
