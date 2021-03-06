import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Search as SearchIcon, Clear as ClearIcon } from '@material-ui/icons';
import selectSearchTerm from './search-term.selector';
import userChangedSearchTerm from './actions/user-changed-search-term.creator';
import Button from '../common/button.component';
import './search.styles.scss';

const Search = () => {
  const dispatch = useDispatch();
  const searchTerm = useSelector(selectSearchTerm);
  const [value, setValue] = useState(searchTerm);
  const handleChange = useCallback(
    (event) => {
      setValue(event.target.value);
      dispatch(userChangedSearchTerm(event.target.value));
    },
    [setValue, dispatch]
  );

  const handleClearClick = useCallback(() => {
    setValue('');
    dispatch(userChangedSearchTerm(''));
  }, [setValue, dispatch]);

  return (
    <div className="search">
      <div className="search__icon">
        <SearchIcon style={{ width: 30, height: 30 }} />
      </div>
      <input
        type="text"
        className="search__input"
        placeholder="Search titles"
        value={value}
        onChange={handleChange}
      />
      <Button
        className={`button--stroke ${value ? 'is-shown' : 'is-hidden'}`}
        onClick={handleClearClick}
      >
        <ClearIcon style={{ width: 30, height: 30 }} />
      </Button>
    </div>
  );
};

export default Search;
