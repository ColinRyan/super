// # Imports

import confetti from 'canvas-confetti'
import './style.css'
import {
  pipe,
  filter,
  omit,
  sum,
  mapAccum,
  map,
  mapObjIndexed,
  groupBy,
  dissoc,
  forEach,
  values,
  sort,
  clone,
  reduce,
} from "ramda";
import { Peer, DataConnection } from "peerjs";

// Define a type that includes the expected keys from URLSearchParams
type SearchParams = {
  hostId?: string;
};

// Create a type assertion function
function asSearchParams(searchParams: URLSearchParams): SearchParams {
  return new Proxy(searchParams, {
    get: (searchParams, prop: keyof SearchParams) =>
      searchParams.get(prop as string),
  }) as unknown as SearchParams;
}

const params = asSearchParams(new URLSearchParams(window.location.search));
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"

const peer = new Peer( );

const userDialog     = document.getElementById("user-info-dialog");
const userList       = document.getElementById("users");
const loaded         = document.getElementById("loaded");
const loading        = document.getElementById("loading");
const settingsButton = document.getElementById("settings-button");




// # Types

interface Data {
  payload: any,
  action: string,

  
}


enum Themes {
  minimalist = "Minimalist",
  migration  = "Migration",
  waves      = "Waves",
}

enum GameTypes {
  storyPointing = "story-pointing",
  tshirtSizing  = "t-shirt-sizing",
}
enum GameModes {
  reveal = "reveal",
  play   = "play",
  wait   = "wait",
}

interface User {
  name    : string;
  category: string;
  theme   : string;
  voted?  : boolean;
  vote?   : number | null;
  host    : boolean;
}

interface State {
  host: {
    conn: DataConnection | null;
  };
  me: User;
  el: {
    main: HTMLElement | null;
  };
  connections: Record<string, DataConnection>;
  users: Record<string, User>;
  matches: [];
  game: {
    type: GameTypes;
    mode: GameModes;
  };
  theme: {
    name: Themes;
    tearDown: (() => void) | null;
  };
}

// # Local State

const state: State = {
  host: {
    conn: null,
  },
  me: {
    name: "",
    category: "default",
    theme: "Minimalist",
    host: false,
  },
  el: {
    main: document.getElementById("content"),
  },
  connections: {},
  users: {},
  game: {
    type: GameTypes.storyPointing,
    mode: GameModes.wait,
  },
  matches: [],
  theme: {
    name: Themes.minimalist,
    tearDown: () => null,
  },
};

const defaultHostData = {
    name    : "fake",
    category: "default",
    theme   : Themes.waves,
    host    : true,

}

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

if (storedUser) {
  state.me = storedUser;
  state.theme.name = storedUser.theme;
}

// Extend the Window interface with a custom state property
declare global {
  interface Window {
    state: State;
    main: HTMLElement | null;
  }
}
window.state = state;
window.main = state.el.main;

// # Funcs


const broadcast = ({actions}: {actions: Array<{action: string, payload: any}>}) => {
  
  forEach((conn: DataConnection) => {
    forEach((action) => {
      conn.send(action);
      
    }, actions)
  }, values(state.connections));
} 



const setTheme = () => {
  console.debug("setTheme", state.theme.name);
  if (state.theme.name === Themes.minimalist) {
    console.debug("setTheme", "min");

    if (loaded) {
      loaded.classList.remove("hidden");
    }
    if (loading) {
      loading.classList.add("hidden");
    }

    
    if (state.theme.tearDown) {
      state.theme.tearDown();
      state.theme.tearDown = null;
    }

    return;
  }

  // Deprecated
  if (state.theme.name === Themes.migration) {

    if (loaded) {
      loaded.classList.remove("hidden");
    }
    if (loading) {
      loading.classList.add("hidden");
    }


    if (state.theme.tearDown) {
      state.theme.tearDown();
      state.theme.tearDown = null;
    }

    return;

  }

  if (state.theme.name === Themes.waves) {
    import("./themes/waves")
      .then((obj) => {
        console.debug("obj", obj);
        if (state.theme.tearDown) {
          state.theme.tearDown();
          state.theme.tearDown = null;
        }

        state.theme.tearDown = obj.tearDown;
        obj.setup();

        if (loaded) {
          loaded.classList.remove("hidden");
        }
        if (loading) {
          loading.classList.add("hidden");
        }



      })
      .catch((err) => {
        console.error(err);
      });
  }
};

const shuffle = (array: any[]) => {
  let currentIndex = array.length;
  let randomIndex: number | undefined;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
};
const showResults = (type = "dev", votes: number[], average: number) => {
  if (votes.length === 0) {
    return;
  }

  const main = state.el.main;
  if (main) {
    const game = main.children[state.game.type];
    const results = game.children.results;
    const item = document.createElement("div");
    const averageResults = document.createElement("div");
    const voteResults = document.createElement("div");

    averageResults.append(
      `${type} average: ${average.toFixed(2)}`
    )

    voteResults.append(
      `${type}  votes: ${shuffle(votes)}`
    )

    item.append(averageResults, voteResults);

    results.append(item);
    results.classList.remove("invisible");
  }
};

const revealVotes = () => {
  const mustHaveVoted = (...users: User[]): User[] =>
    filter((user: User) => {
      return user.vote !== null;
    }, users);
  const usersToVotes = (users: User[]): number[] =>
    map((user: User) => {
      if (user.vote) {
        return user.vote;
      }
      return 0;
    }, users);


  const allUsers: User[] = values(state.users);
  const qcVotes = pipe<User[], User[], User[], number[]>(
    mustHaveVoted,
    (users: User[]): User[] =>
      filter((user: User) => {
        return user.category === "qc";
      }, users),
    usersToVotes,
  )(...allUsers);

  const devVotes = pipe<User[], User[], User[], number[]>(
    mustHaveVoted,
    (users: User[]) =>
      filter((user) => {
        return user.category === "dev";
      }, users),
    usersToVotes,
  )(...values(state.users));

  console.debug("votes", devVotes);
  const devAverage = sum(devVotes) / devVotes.length;
  const qcAverage = sum(qcVotes) / qcVotes.length;

  showResults("dev", devVotes, devAverage);
  showResults("qc", qcVotes, qcAverage);

  console.debug("send user list to all players");

  const allVotes = pipe<User[], User[], number[]>(
    mustHaveVoted,
    usersToVotes,
  )(...values(state.users))

  // if allVotes are the same

  const allVotesAreTheSame = allVotes.every((vote) => {
    return vote === allVotes[0];
  });

  
  if (allVotesAreTheSame) {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });


  }


  broadcast({
    actions: [{
      action: "show_results",
      payload: {
        votes: devVotes,
        average: devAverage,
        qcVotes: qcVotes,
        qcAverage: qcAverage,
        allVotesAreTheSame: allVotesAreTheSame,
      }
    }]

  })

  state.game.mode = GameModes.reveal;
};

const initalizeGame = () => {
  const main = state.el.main;
  if (main) {
    const children: Element[] = Array.from(main.children);

    forEach((el: Element) => {
      console.debug("el", el);

      el.classList.add("hidden");
    }, children);

    const game = main.children[state.game.type];
    game.classList.toggle("hidden");
    document.documentElement.style.setProperty("--content", "");

    if (state.me.host === true) {
      console.debug("test");
      game.children["content"].children["reveal"].classList.remove("hidden");
    }

    state.game.mode = GameModes.play;
  }
};

const listPlayers = () => {
  if (userList) {
    userList.innerHTML = "";

    console.debug("state", state);
    console.debug("values(state.users)", values(state.users));
    const users: User[] = values(state.users);
    const usersByCategory: Record<string, User[]> = groupBy((user): string => {
      return user.category;
    }, users) as Record<string, User[]>;

    const usersByCategoryHTML: Record<string, HTMLElement> = mapObjIndexed(
      (users: User[], category: string): HTMLElement => {
        const figure = document.createElement("figure");
        figure.title = category;
        const figCaption = document.createElement("figcaption");
        figCaption.innerText = category;
        figure.appendChild(figCaption);
        const ul = document.createElement("ul");

        const listItems = map((user) => {
          const li = document.createElement("li");
          const leftSpan = document.createElement("span");
          const rightSpan = document.createElement("span");

          leftSpan.innerText = `${user.name} ${user.host ? "♔" : ""}`;

          li.appendChild(leftSpan);


          if (user.category !== "spectator") {
            const check = document.createElement("input");
            check.type = "checkbox";
            if (user.voted) {
              check.checked = true;
            }
            
            check.onclick = (e) => {
              e.preventDefault();
              e.stopPropagation();

            }
            rightSpan.appendChild(check);
            
            li.appendChild(rightSpan);
          }

          return li;
        }, users);

        ul.append(...listItems);
        figure.appendChild(ul);

        return figure;
      },
      usersByCategory,
    );
    console.debug("userLists", usersByCategoryHTML);

    const sortedUsersByCategoryHTML = sort(
      (a: HTMLElement, b: HTMLElement) => {
        if (a.title === "host") {
          return -1;
        }
        if (b.title === "host") {
          return 1;
        }
        if (b.title === a.title) {
          return 0;
        }

        return -1;
      },
      [...values(usersByCategoryHTML)],
    );

    console.debug("sortedUsersByCategoryHTML", sortedUsersByCategoryHTML);
    const title = document.createElement("p");
    title.innerText = "Teams";
    title.classList.add("title");
    userList.append(title, ...sortedUsersByCategoryHTML);
  }
};


// # respond to click events on buttons.
// This is a generic click event handler that will capture ALL click events.

if (state.el.main) {
  state.el.main.addEventListener("click", (event: MouseEvent) => {
    const el = event.target;
    console.debug("el", el)
    if (el instanceof HTMLInputElement) {
      if (el?.type !== "button") {
        return;
      }
      if (el.name === "restart") {
        console.debug("restart game");

        el.classList.toggle("hidden");
        if (state.el.main !== null) {
          state.el.main.children[state.game.type].children['content'].children[
            "reveal"
          ].classList.toggle("hidden");
          state.el.main.children[state.game.type].children[
            "results"
          ].innerHTML = "";
          state.el.main.children[state.game.type].children[
            "results"
          ].classList.add("invisible");

        }

        state.users = map((user) => {
          return omit(["voted", "vote"], user);
        }, state.users);

        state.me = omit(["voted", "vote"], state.me);
        listPlayers();
        broadcast({
          actions : [{ action: "restart_game", payload: state.users }],
          
        })
        state.game.mode = GameModes.play;

        return;
      }
      if (el.name === "reveal") {
        console.debug("reveal something");
        state.users[state.me.name].vote = state.me.vote;
        el.classList.toggle("hidden");
        if (state.el.main !== null) {
          state.el.main.children[state.game.type].children['content'].children[
            "restart"
          ].classList.toggle("hidden");
        }

        
        broadcast({
          actions : [{ action: "reveal_vote", payload: true }],
        })

        state.game.mode = GameModes.reveal;

        return;
      }
      // # Default action. You're voting

      console.debug("test")
      state.me.voted = true;
      state.me.vote = parseInt(el.value);

      console.debug("state.me", state.me);
      if (state.me.host !== true) {
        if (state.host.conn) {
          console.debug("state.host.conn", state.host.conn)
          state.host.conn.send({
            action: "user_voted",
            payload: { name: state.me.name },
          });
        }
      } else {
        state.users[state.me.name].voted = true;

        listPlayers();

        broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })
      }
    }
  });
}


const closeDialog = () => {
  if (userDialog && userDialog instanceof HTMLDialogElement) {
    
    userDialog.close("cancel");
    userDialog.classList.remove("close")
    userDialog.removeEventListener('animationend',closeDialog)


  
  }
  

}

if (settingsButton) {
  settingsButton.addEventListener("click", () => {
    const cancel = document.getElementById("user-info-dialog-cancel");
    document.forms["user-info-form"].name.value = state.me.name;

    if (userDialog && userDialog instanceof HTMLDialogElement) {
      if (cancel) {
        cancel.addEventListener("click", (e) => {
          console.debug("cancel", e);
          e.preventDefault();
          e.stopPropagation();
          userDialog.classList.add("close")
          userDialog.addEventListener('animationend',closeDialog)
          
        });
      }

      const confirm = document.getElementById("user-info-dialog-confirm");

      if (confirm) {
        confirm.addEventListener("click", (e) => {
          console.debug("test");
          console.debug("confirm", e);
          e.preventDefault();
          e.stopPropagation();
          userDialog.close("confirm");
        });
      }

      userDialog.addEventListener("keydown", (e) => {
        console.log(e.key);
        if (e.key === "Enter") {
          console.debug("enter confirm", e);

          userDialog.close("confirm");
        }
      });

      if (main) {
        main.children["host-loading"].classList.add("hidden");
      }

      userDialog.showModal();
    }
  });
}


peer.on("error", (err) => {
  console.debug("err", err)

})


// # PeerJS
peer.on("open", (id) => {
  const hostId = params.hostId;
  const main = state.el.main;

  console.debug(`My peer ID is ${id}`);

  const shareButton = document.getElementById("share-copy");
  if (shareButton) {
    shareButton.addEventListener("click", () => {
      navigator.clipboard.writeText(`${location.href}?hostId=${id}`);
    });
  }

  if (userDialog && userDialog instanceof HTMLDialogElement) {
    console.debug("userDialog", userDialog)
    userDialog.addEventListener("close", (e) => {
      console.debug("closing", e);
      console.debug("hostDialog", userDialog);

      if (state.game.mode === GameModes.wait) {
        if (main) {
          main.children["host-loading"].classList.toggle("hidden");
        }
      }

      if (
        userDialog.returnValue === "" ||
        userDialog.returnValue === "cancel"
      ) {
        return;
      }

      console.debug("userDialog.returnValue", userDialog.returnValue);
      const hostForm = document.forms["user-info-form"];
      console.debug("hostForm.name.value", hostForm.name.value);
      const hostInfo = Array.from(new FormData(hostForm).entries());
      const user = reduce(
        (acc, prop: [string, any]) => {
          acc[prop[0]] = prop[1];
          return acc;
        },
        defaultHostData,
        hostInfo,
      );

      localStorage.setItem("host", JSON.stringify(user));

      delete state.users[state.me.name];

      state.users[user.name] = { ...user, voted: false, host: false};
      state.me = user;

      state.theme.name = user.theme;
      setTheme();
      listPlayers();

      broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })

    });
  }

  if (hostId) {
    // You aren't the host

    state.me.host = false;

    const share = document.getElementById("share");

    if (share) {
      share.classList.add("hidden");
    }


    //
  } else {
    // You are the host

    state.me.host = true;

    if (shareButton) {
      shareButton.classList.toggle("hidden");
    }

    const user = JSON.parse(
      localStorage.getItem("host") ??
        JSON.stringify("{}")
    );
    // Fix a data bug
    if (user.name !== undefined) {
      if (user.category === "host") {
        user.category = "dev"
        user.host = true
        
      
      }
      
      state.users[user.name] = { ...user, voted: false };
      state.me = user;
      state.theme.name = user.theme;
      setTheme();

      listPlayers();
      console.debug("main", main);
      if (main) {
        main.children["host-loading"].classList.toggle("hidden");
      }
    } else {
      if (userDialog && userDialog instanceof HTMLDialogElement) {
        userDialog.showModal();
      }
    }
  }

  // connect to players
  peer.on("connection", (conn) => {
    conn.on("open", () => {
      // data comes from the player, processed by the host
      conn.on("data", (d) => {
        const data = d as Data
        const payload = data.payload;

        console.debug("data", data);
        switch (data.action) {
          case "ping":
            console.debug("connection started...", payload);
            break;

          case "remove_user":
            console.debug("User informs host they're leaving", payload);
            state.users = dissoc(payload.name, state.users);
            state.connections = dissoc(payload.name, state.connections);

            console.debug("state", state);

            broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })

            listPlayers();
            break;

          case "reveal_vote":
            console.debug("Counting votes");

            state.users[payload.name].vote = payload.vote;
            const voteCountExpected = mapAccum(
              (acc, user) => {
                const voted = user.voted ? 1 : 0;
                return [acc + voted, voted];
              },
              0,
              values(state.users),
            );
            console.debug("voteCountExpected", voteCountExpected);

            const voteCountActual = mapAccum(
              (acc, user) => {
                const vote = user.vote ? 1 : 0;
                return [acc + vote, vote];
              },
              0,
              values(state.users),
            );

            if (voteCountActual[0] === voteCountExpected[0]) {
              revealVotes();
            }

            break;
          case "user_voted":
            console.debug("new user added to host!", payload);
            state.users[payload.name].voted = true;

            broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })


            listPlayers();
            break;

          case "add_user":
            console.debug("new user added to host!", payload);
            const key = payload.was ?? payload.name;
            delete state.connections[key];
            delete state.users[key];

            state.users[payload.name] = { ...payload, voted: false };
            state.connections[payload.name] = conn;

            broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })


            conn.send({ action: "initalize_game", payload: state.game });

            if (
              values(state.users).length > 1 &&
              state.game.mode === GameModes.wait
            ) {
              initalizeGame();
            }

            listPlayers();
            break;
          default:
            console.log("default");
            break;
        }
      });

      conn.send({ action: "ping", payload: "Welcome!" });
    });
  });

  // connect to host
  if (hostId) {
    const conn = peer.connect(hostId);
    state.host.conn = conn;
    console.debug("conn", conn);
    console.debug("hostId", hostId);

    conn.on("open", () => {
      if (userDialog && userDialog instanceof HTMLDialogElement) {
        userDialog.addEventListener("close", (e) => {
          if (main) {
            main.children["host-loading"].classList.add("hidden");

            
          
          }
          

          if (
            userDialog.returnValue === "" ||
              userDialog.returnValue === "cancel"
          ) {
            return;
          }

          console.debug("userDialog.returnValue", userDialog.returnValue);
          if (e.target) {
            const userForm = e.target.firstElementChild;
            const userInfo = new FormData(userForm);
            const user = {};
            userInfo.forEach((value, key) => (user[key] = value));

            localStorage.setItem("user", JSON.stringify(user));


            console.debug("userInfo", userInfo);

            console.debug("user", user);

            state.theme.name = user.theme;
            setTheme();

            conn.send({
              action: "add_user",
              payload: { was: clone(state.me.name), ...user },
            });

            state.me = user;

            listPlayers();
            broadcast({ actions: [{ action: "refresh_users", payload: state.users }] })


            
          
          }
          

                  });

      }


      if (userDialog && userDialog instanceof HTMLDialogElement &&  typeof userDialog.showModal === "function") {
        const user = JSON.parse(localStorage.getItem("user") ||  "{}");
        if (user.name !== undefined) {
          // Fix a data related bug
          if (user.host === undefined) {
            user.host = false
            
          
          }
          
          conn.send({ action: "add_user", payload: user });
          state.me = user;
          state.theme.name = user.theme;
          setTheme();
        } else {
          userDialog.showModal();
        }
      }
      window.addEventListener("beforeunload", (event) => {
        event.returnValue = "";
        conn.send({ action: "remove_user", payload: state.me });
        return null;
      });

      // Send from host to Player
      conn.on("data", (d) => {
        const data = d as Data;
        console.debug("From Host", data);
        const payload = data.payload;

        console.debug("data", data);
        switch (data.action) {
          case "ping":
            console.debug("Host says hello", payload);
            break;
          case "refresh_users":
            console.debug("new users!", payload);
            state.users = payload;
            listPlayers();
            break;

          case "show_results":
            showResults("dev", payload.votes, payload.average);
            showResults("qc", payload.qcVotes, payload.qcAverage);
            if (payload.allVotesAreTheSame) {
              confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 },
              });
              
            
            }
            

            break;

          case "restart_game":
            state.me = omit(["votes", "vote"], state.me);

            if(state.el.main) {
              console.debug("state.el.main", state.el.main)
              state.el.main.children[state.game.type].children[
                "results"
              ].innerText = "";
              state.el.main.children[state.game.type].children[
                "results"
              ].classList.add("invisible");

            }
            state.users = payload;
            listPlayers();

            break;
          case "reveal_vote":
            conn.send({
              action: "reveal_vote",
              payload: {
                name: state.me.name,
                vote: state.me.vote,
              },
            });
            break;
          case "add_user":
            console.debug("new user!", payload);
            state.users[payload.name] = { ...payload, voted: false };
            listPlayers();
            break;
          case "initalize_game":
            state.game.type = payload.type;
            initalizeGame();
            break;
          default:
            console.log("default");
            break;
        }
      });
      conn.send({ action: "ping", payload: "I've arrived!" });
    });
  }



  setTheme();
});

