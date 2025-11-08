import { IoMdSearch, IoMdClose  } from "react-icons/io";
import "./scss/SearchUserModal.scss"
import { useCallback, useRef, useState } from "react";
import { useApi } from "../services/useApi";
import { GetImageUrl } from "../utils/general";
import { useDispatch, useSelector } from "react-redux";
import { pushSentConnection } from "../redux/connection/connectionSlice";
import { toast } from "react-toastify";

function SearchUserModal({ onClose }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const api = useApi();
  const dispatch = useDispatch();
  const translations = useSelector((state) => state.translations.english);

  const searchUser = async (query) => {
    if (!query.trim()) {
      setSearchResult([]);
      return;
    }
    try {
      const res = await api.get(`/user/search?query=${query}`);
      setSearchResult(res.data.data);
    } catch (e) {
      console.error(e.response.message);
    }
  };

  const debounceTimeout = useRef(null);

  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (value.trim()) {
        setHasSearched(true);
        searchUser(value);
      } else {
        setHasSearched(false);
        setSearchResult([])
      }
    }, 500);
  }, []);

  const handleAddUser = async (userId) => {

    try {
      const res = await api.post("connection/add", JSON.stringify(userId), {
        headers: { "Content-Type": "application/json" },
      });
      const connection = res.data.data;
      dispatch(pushSentConnection({ connection }));
      toast.success(translations[res.data.message])
      onClose();
    } catch (e) {
      console.error(e.response.data);
      toast.error(translations[e.response.data.message])
      onClose();
    }
  };

  return (
    <div className="SearchWrapper">
      <div className="SearchUsers">
        <IoMdSearch className="SearchUsers--Glass" />
        <input
          className="SearchUsers--Input"
          type="text"
          placeholder="Search by username"
          value={searchQuery}
          onChange={handleSearchChange}
          autoComplete="off"
        />
        <IoMdClose
          className="SearchUsers--Close"
          onClick={() => {
            setSearchResult([]);
            setSearchQuery("");
            setHasSearched(false);
          }}
        />
      </div>

      {searchResult.length > 0 ? (
        <table className="SearchResult">
          <tr className="Header">
            <th></th>
            <th>Username</th>
            <th className="Add-th">Add</th>
          </tr>
          {searchResult.map((u) => (
            <tr
              key={u.id}
            >
              <td><img src={GetImageUrl(u.avatar)} /></td>
              <td>{u.username}</td>
              <td className="Add-td">
                <button
                  onClick={() => handleAddUser(u.id)}
                >
                  Send
                </button>
              </td>
            </tr>
            ))}
        </table>
      ) : searchResult.length == 0 && hasSearched ? <p>No user found</p> : null}
    </div>
  )
}

export default SearchUserModal;