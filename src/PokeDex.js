import "./App.css";
import { useState, useEffect } from "react";
import ReactLoading from "react-loading";
import axios from "axios";
import Modal from "react-modal";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    background: "black",
    color: "white",
  },
  overlay: { backgroundColor: "grey" },
};

function Poke() {
  const [listData, setListData] = useState([]);
  const [pokemons, setPokemons] = useState([]);
  const [pokemonDetail, setPokemonDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [color, setChangeColor] = useState("");
  const [listId, setClickId] = useState(null);
  const [query, setSearchQuery] = useState(null);
  const [_sort, setSort] = useState(false);
  const [details, setDetails] = useState({});
  const [isFiltered, setIsFiltered] = useState(false);
  const [PaginationNumbers, setPaginationNumbers] = useState(null);

  const paginationChunkData = (data, index) => {
    let paginationData = [...data].slice(index, index + 5);
    setPokemons(paginationData);
  };

  const paginationCount = (data) => {
    let count = data.length;
    setPaginationNumbers(count);
  };

  useEffect(() => {
    setIsLoading(true);
    axios.get(`https://pokeapi.co/api/v2/pokemon`).then((res) => {
      const persons = res.data;
      setListData(persons.results);
      paginationCount(persons.results);
      paginationChunkData(persons.results, 0);
      setIsLoading(false);
    });
  }, []);

  const onMouseEnter = (event, index) => {
    setChangeColor("yellow");
    setClickId(index);
  };

  const onClick = (item) => {
    setPokemonDetail(true);
    const { url } = item;
    axios.get(`${url}`).then((res) => {
      const details = res.data;
      setDetails(details);
    });
  };

  const OnKeyUp = (event) => {
    const query = event.target.value;
    if (query !== "") {
      const results = listData.filter((user) => {
        return user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1;
      });
      paginationCount(results);
      setIsFiltered(true);
      paginationChunkData(results, 0);
    } else {
      paginationCount(listData);
      setPokemons(listData);
      setIsFiltered(false);
      paginationChunkData(listData, 0);
    }
    setSearchQuery(query);
  };

  const sort = () => {
    setSort((prevState) => {
      if (prevState) {
        let result = [...pokemons].sort((a, b) =>
          a.name.toLowerCase() > b.name.toLowerCase() ? 1 : -1
        );
        setPokemons(result);
        return !prevState;
      }
      let result = [...pokemons].sort((a, b) =>
        a.name.toLowerCase() < b.name.toLowerCase() ? 1 : -1
      );
      setPokemons(result);
      return !prevState;
    });
  };

  const handlePagination = (number) => {
    let index = number * 5;
    index = index - 5;
    paginationChunkData(listData, index);
  };

  const Pagination = () => {
    let total = isFiltered ? PaginationNumbers : listData.length;
    let buttons = total / 5;
    buttons = !Number.isInteger(buttons) ? Math.trunc(buttons) + 1 : buttons;
    let totalButtons = Array.from({ length: buttons }, (v, k) => k + 1);
    if (!totalButtons.length) return null;
    return (
      <div className="pagination">
        {totalButtons.map((num, index) => (
          <button onClick={() => handlePagination(num)}>{num}</button>
        ))}
      </div>
    );
  };

  const List = (pokemons) => {
    return (
      <div className="user-list">
        {pokemons && pokemons.length > 0 ? (
          pokemons.map((user, index) => (
            <li
              key={index}
              className="user"
              style={{ color: index === listId ? color : "" }}
              onMouseEnter={(event) => onMouseEnter(event, index)}
            >
              <span className="user-name" onClick={() => onClick(user)}>
                {user.name}
              </span>
              <span className="user-age">{user.url}</span>
            </li>
          ))
        ) : (
          <h1>No results found!</h1>
        )}
      </div>
    );
  };

  // if (!isLoading && pokemons.length === 0) {
  //   return (
  //     <div>
  //       <header className="App-header">
  //         <h1>Welcome to pokedex !</h1>
  //         <h2>Requirement:</h2>
  //         <ul>
  //           <li>
  //             Call this api:https://pokeapi.co/api/v2/pokemon to get pokedex, and show a list of pokemon name.
  //           </li>
  //           <li>Implement React Loading and show it during API call</li>
  //           <li>when hover on the list item , change the item color to yellow.</li>
  //           <li>when clicked the list item, show the modal below</li>
  //           <li>
  //             Add a search bar on top of the bar for searching, search will run
  //             on keyup event
  //           </li>
  //           <li>Implement sorting and pagingation</li>
  //           <li>Commit your codes after done</li>
  //           <li>If you do more than expected (E.g redesign the page / create a chat feature at the bottom right). it would be good.</li>
  //         </ul>
  //       </header>
  //     </div>
  //   );
  // }

  return (
    <div className="container">
      <header className="App-header">
        {isLoading ? (
          <>
            <div className="App">
              <header className="App-header">
                <ReactLoading type={"bars"} color="#fff" />
              </header>
            </div>
          </>
        ) : (
          <>
            <h1>Welcome to pokedex !</h1>
            <div>
              <input
                type="search"
                value={query}
                onChange={OnKeyUp}
                className="input"
                placeholder="Filter"
              />
              <button className="button" onClick={sort}>
                Sort
              </button>
            </div>
            <div className="user-list">
              {List(pokemons)}
              {Pagination(pokemons)}
            </div>
          </>
        )}
      </header>
      {pokemonDetail && (
        <Modal
          isOpen={pokemonDetail}
          contentLabel={pokemonDetail?.name || ""}
          onRequestClose={() => {
            setPokemonDetail(null);
          }}
          style={customStyles}
        >
          <div>
            <img
              src={details && details.sprites && details.sprites.front_default}
              alt="pokemonImage"
            />
            <br></br>
            <table>
              <tbody>
                <tr>
                  <th>stat_name</th>
                  <th>base_stat</th>
                </tr>
                {details &&
                  details.stats &&
                  details.stats.map((val, key) => {
                    return (
                      <tr key={key}>
                        <td>{val.stat.name}</td>
                        <td>{val.base_stat}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
            Requirement:
            <ul>
              <li>show the sprites front_default as the pokemon image</li>
              <li>
                Show the stats details - only stat.name and base_stat is
                required in tabular format
              </li>
              <li>Create a bar chart based on the stats above</li>
              <li>
                Create a buttton to download the information generated in this
                modal as pdf. (images and chart must be included)
              </li>
            </ul>
          </div>
        </Modal>
        // <ModalComp pokemonDetail={pokemonDetail} setPokemonDetail={setPokemonDetail} selectedItem={selectedItem} />
      )}
    </div>
  );
}

export default Poke;

// const ModalComp = (props) => {
//   const [data, setData] = useState({});

//   useEffect(() => {
//     const { url } = props.selectedItem;
//     axios.get(`${url}`)
//       .then(res => {
//         const details = res.data;
//         setData(details);
//       })
//   }, [])

//   return (
//     <Modal
//       isOpen={props.pokemonDetail}
//       contentLabel={props.pokemonDetail?.name || ""}
//       onRequestClose={() => {
//         props.setPokemonDetail(null);
//       }}
//       style={customStyles}
//     >
//       <div>
//         Requirement:
//         <ul>
//           <li>show the sprites front_default as the pokemon image</li>
//           <li>
//             Show the stats details - only stat.name and base_stat is
//             required in tabular format
//           </li>
//           <li>Create a bar chart based on the stats above</li>
//           <li>Create a  buttton to download the information generated in this modal as pdf. (images and chart must be included)</li>
//         </ul>
//       </div>
//     </Modal>
//   )
// }
