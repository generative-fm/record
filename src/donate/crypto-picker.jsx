import React, { useState, useRef, useCallback } from 'react';
import classnames from 'classnames';
import TextButton from '../common/button.component';
import bitcoinImageSrc from './qr-codes/bitcoin.png';
import bitcoinCashImageSrc from './qr-codes/bitcoin-cash.png';
import ethereumImageSrc from './qr-codes/ethereum.png';
import litecoinImageSrc from './qr-codes/litecoin.png';
import styles from './crypto-picker.module.scss';

const execCommandCopy = (text) =>
  new Promise((resolve) => {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    resolve();
  });

const clipboardApiCopy = (text) => navigator.clipboard.writeText(text);

const copyToClipboard = navigator.clipboard
  ? clipboardApiCopy
  : execCommandCopy;

const CRYPTOS = [
  {
    ticker: 'BTC',
    name: 'Bitcoin',
    address: '3DMb8BQVTtfVv59pMLmZmHr6xSoJsb3P4Z',
    imageSrc: bitcoinImageSrc,
  },
  {
    ticker: 'BCH',
    name: 'Bitcoin Cash',
    address: 'qpaj0q6ef46jz80fmdwccgwrms9rvr0h7vylm5u49j',
    imageSrc: bitcoinCashImageSrc,
  },
  {
    ticker: 'ETH',
    name: 'Ethereum',
    address: '0x60e6B0111716eDD65ae4064AdD6db99c5B5C72aA',
    imageSrc: ethereumImageSrc,
  },
  {
    ticker: 'LTC',
    name: 'Litecoin',
    address: 'MUn71TQJy7AJDpEmfbGygn76jTces76bM8',
    imageSrc: litecoinImageSrc,
  },
];

const CryptoPicker = () => {
  const [currentCrypto, setCurrentCrypto] = useState(CRYPTOS[0]);
  const tabCallbacksRef = useRef(
    CRYPTOS.map((crypto) => () => setCurrentCrypto(crypto))
  );
  const handleCopyClick = useCallback(() => {
    copyToClipboard(currentCrypto.address);
  }, [currentCrypto]);
  return (
    <div className={styles['crypto-picker']}>
      <div className={styles['crypto-picker__tabs']}>
        {CRYPTOS.map(({ ticker }, i) => (
          <button
            key={ticker}
            type="button"
            className={classnames(styles['crypto-picker__tabs__tab'], {
              [styles['crypto-picker__tabs__tab--is-active']]:
                currentCrypto.ticker === ticker,
            })}
            onClick={tabCallbacksRef.current[i]}
          >
            {ticker}
          </button>
        ))}
      </div>
      <div className={styles['crypto-picker__current-crypto']}>
        {currentCrypto.name} address:
        <div className={styles['crypto-picker__current-crypto__address']}>
          <input
            type="text"
            value={currentCrypto.address}
            readOnly
            className={styles['crypto-picker__current-crypto__address__value']}
            size={currentCrypto.address.length}
          />

          <TextButton
            onClick={handleCopyClick}
            className="button--text button--primary"
          >
            Copy
          </TextButton>
        </div>
        <img
          className={styles['crypto-picker__current-crypto__qr-code']}
          src={currentCrypto.imageSrc}
        />
      </div>
    </div>
  );
};

export default CryptoPicker;
