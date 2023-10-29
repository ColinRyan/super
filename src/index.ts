// # Imports

import {pipe, filter, omit, sum, mapAccum, map, mapObjIndexed, groupBy, dissoc, forEach, values, sort, clone} from 'ramda'
import {Peer} from 'peerjs'



const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"

const peer = new Peer()

const userDialog = document.getElementById("user-info-dialog")
const hostDialog = document.getElementById("host-info-dialog")
const userList = document.getElementById("users")


// # Types

enum Themes {
    minimalist = 'Minimalist',
    migration = 'Migration',
    waves = 'Waves',


}

enum GameTypes {
    storyPointing = 'story-pointing',
    tshirtSizing = 't-shirt-sizing',

}
enum GameModes {
    reveal = 'reveal',
    play = 'play',
    wait = 'wait', 
}

// # Local State

const state = {
    host: {
        conn: null
    },
    me: {
      name: "",
      category: "",
      theme: "Minimalist",


      
      

    },
    el: {
        main: document.getElementById("content")

    }, 
    connections: {

    },
    users : {

    }, 
    game: {
        type: GameTypes.storyPointing,
        mode: GameModes.wait

    },
    matches: [

    ],
    theme: {
        name: Themes.minimalist,
        tearDown: () => null
    }


    
    
}


window.state = state
window.main = state.el.main

// # respond to click events on buttons.
state.el.main.addEventListener('click', (event) => {
  const el = event.target
  if (el.type !== "button") {
      return
  }

  if (el.name === "restart") {
      console.debug("restart game")


      el.classList.toggle("hidden")
      state.el.main.children[state.game.type].children["reveal"].classList.toggle("hidden")
      state.el.main.children[state.game.type].children["results"].innerHTML = ""


      state.users = map((user) => {
          return omit(["voted", "vote" ], user)
      }, state.users)

      state.me = omit(["voted", "vote"], state.me)
      listPlayers()
      forEach((conn) => {
          console.debug("time to reveal all votes")
          conn.send({action: 'restart_game', payload: true})
          conn.send({action: 'refresh_users', payload: state.users})

      }, values(state.connections))

      state.game.mode = GameModes.play


      return

  }

  if (el.name === "reveal") {
      console.debug("reveal something")
      state.users[state.me.name].vote = state.me.vote
      el.classList.toggle("hidden")
      state.el.main.children[state.game.type].children["restart"].classList.toggle("hidden")
      forEach((conn) => {
          console.debug("time to reveal all votes")
          conn.send({action: 'reveal_vote', payload: true})
      }, values(state.connections))

      state.game.mode = GameModes.reveal

      return
      
  }

  // # Default action. You're voting

  state.me.voted = true
  state.me.vote  = el.value

  console.debug("state.me", state.me)
  if (state.me.category !== "host") {
      state.host.conn.send({action: "user_voted", payload: {name: state.me.name}})
  }
  else {

      state.users[state.me.name].voted = true

      listPlayers()

      forEach((conn) => {
          console.debug("send user list to all players")
          console.debug("conn", conn)
          conn.send({action: 'refresh_users', payload: state.users})
      }, values(state.connections))
  }
})


const settingsButton = document.getElementById("settings-button")

// # Funcs

const setTheme = () => {

  
    if (state.theme.name === Themes.minimalist) {
      return
    }

   
    if (state.theme.name === Themes.migration) {
        import('./themes/migration').then((obj) => {
            console.debug("obj", obj)
            state.theme.tearDown = obj.tearDown
        }).catch((err) => {
            console.error(err)
        });
    }

    if (state.theme.name === Themes.waves) {
        import('./themes/waves').then((obj) => {
            console.debug("obj", obj)
            state.theme.tearDown = obj.tearDown
        }).catch((err) => {
            console.error(err)
        });
    }
}

setTheme()

const shuffle = (array) => {
  let currentIndex = array.length,  randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex > 0) {

    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }

  return array;
}
const showResults = (votes, average) => {
    const main = state.el.main
    const game = main.children[state.game.type]
    const results = game.children.results
   

    results.append(`average: ${average.toFixed(2)}`)
    results.append(`  votes: ${shuffle(votes)}`)


}

const revealVotes =  () => {
    const votes = pipe(

        filter((user) => {
            return user.vote !== null
        }),
        filter((user) => {
          return user.details.category !== 'spectator'
        }),

        map((user) => {
            return user.vote
        })
   )(values(state.users))

    console.debug("votes", votes)
    const average = sum(votes)/votes.length 

    showResults(votes, average)
    forEach((conn) => {
        console.debug("send user list to all players")
        console.debug("conn", conn)
        conn.send({action: 'show_results', payload: {
            votes,
            average
        }})
    }, values(state.connections))

    state.game.mode = GameModes.reveal



}



const initalizeGame = () => {

    const main = state.el.main
  forEach((el: HTMLElement) => {
    console.debug("el", el)
      
       el.classList.add("hidden")
    
    },main.children)

    const game = main.children[state.game.type]
    game.classList.toggle("hidden")

    if (state.me.category === "host") {
        console.debug("test")
        game.children["reveal"].classList.remove("hidden")
    }


    state.game.mode = GameModes.play



} 

const listPlayers = () => {
    

    userList.innerHTML = ""
    console.debug("state", state)
    console.debug("values(state.users)", values(state.users))
    const usersByCategory = groupBy((user) => {
       return user.details.category
    
    }, values(state.users))

    const usersByCategoryHTML = mapObjIndexed((users, category) => {
            const figure = document.createElement("figure")
            figure.title = category
            const figCaption = document.createElement("figcaption")
            figCaption.innerText = category
            figure.appendChild(figCaption)
            const ul = document.createElement("ul")

            const listItems = map((user) => {
                const li = document.createElement("li")
                li.innerText = `${user.details.name}`

                if (user.details.category !== 'spectator') {
                  li.innerText = `${user.details.name}${user.voted ? " 🗹": " ☐"}`
                
                }
                
                return li
            }, users)
            
            ul.append(...listItems)
            figure.appendChild(ul)
            return figure

    }, usersByCategory )
    console.debug("userLists", usersByCategoryHTML)

  
  
  const sortedUsersByCategoryHTML = sort((a,b) => {
    if (a.title === 'host') {
      return -1
    }
    if (b.title === 'host') {
      return 1
    }
    if (b.title === a.title) {
      return 0 
    }

    return -1
    },
    [...values(usersByCategoryHTML)])
    console.debug("sortedUsersByCategoryHTML", sortedUsersByCategoryHTML)
    userList.append( "Players", ...sortedUsersByCategoryHTML)
  

  

  
  
   

}




peer.on('open', (id) => {
    const hostId = params.hostId; 
    const main = state.el.main

    console.debug(`My peer ID is ${id}` )

    const shareButton = document.getElementById("share-copy")
    shareButton.addEventListener('click', (event) => {
        navigator.clipboard.writeText(`${location.href}?hostId=${id}`)
    })

    hostDialog.addEventListener('close',(e) => {

      console.debug("closing", e)
      console.debug("hostDialog", hostDialog)

      if (state.game.mode === GameModes.wait) {
        main.children["host-loading"].classList.toggle("hidden")

        
      
      }
      
      if (hostDialog.returnValue === "" || hostDialog.returnValue === "cancel") {
        return 
      }

      console.debug("userDialog.returnValue", hostDialog.returnValue)
      const hostForm = document.forms["host-info-form"]
      console.debug("hostForm.name.value", hostForm.name.value)
      const hostInfo = new FormData(hostForm)
      const user = {}
      hostInfo.forEach((value, key) => (user[key] = value))
      console.debug("hostInfo", hostInfo)

      localStorage.setItem("host", JSON.stringify(user))

      delete state.users[state.me.name]

      state.users[user.name] = { voted: false, details: user }
      state.me = user

      state.theme.name = user.theme
      setTheme()
      listPlayers()
      hostDialog.hidden = true

      forEach((conn) => {
        console.debug("send user list to all players")
        console.debug("conn", conn)
        conn.send({action: 'refresh_users', payload: state.users})
      }, values(state.connections))


      


    })


    if (hostId) {
        // You aren't the host
        settingsButton.addEventListener('click', (event) => {


          main.children["host-loading"].classList.add("hidden")


          const cancel = document.getElementById("user-info-dialog-cancel")
          document.forms["user-info-form"].name.value = state.me.name
          cancel.addEventListener("click", (e) => {
            console.debug("cancel", e)
            e.preventDefault()
            e.stopPropagation()
            userDialog.close("cancel")
          })


          const confirm = document.getElementById("user-info-dialog-confirm")
          confirm.addEventListener("click", (e) => {
            console.debug("test")
            console.debug("confirm", e)
            e.preventDefault()
            e.stopPropagation()
            userDialog.close("confirm")
          })

          userDialog.addEventListener("keydown", (e) => {
            console.log(e.key)
            if (e.key === "Enter") {
              console.debug("enter confirm", e)

              userDialog.close("confirm")
            }
          },)


          userDialog.showModal()

        })
    //
    } else {
        // You are the host

      settingsButton.addEventListener('click', (event) => {



        const cancel = document.getElementById("host-info-dialog-cancel")
        document.forms["host-info-form"].name.value = state.me.name
        cancel.addEventListener("click", (e) => {
          console.debug("cancel", e)
          e.preventDefault()
          e.stopPropagation()
          hostDialog.close("cancel")
        })


        const confirm = document.getElementById("host-info-dialog-confirm")
        confirm.addEventListener("click", (e) => {
          console.debug("test")
          console.debug("confirm", e)
          e.preventDefault()
          e.stopPropagation()
          hostDialog.close("confirm")
        })

        hostDialog.addEventListener("keydown", (e) => {
          console.log(e.key)
          if (e.key === "Enter") {
            console.debug("enter confirm", e)

            hostDialog.close("confirm")
          }
        },)
        main.children["host-loading"].classList.add("hidden")

        hostDialog.showModal()
        hostDialog.hidden = false

      })

      shareButton.classList.toggle("hidden")
      const user = JSON.parse(localStorage.getItem("host"))
      if (user) {
          state.users[user.name] = { voted: false, details: user }
          state.me = user
          listPlayers()
          console.debug("main", main)
          main.children["host-loading"].classList.toggle("hidden")


      }
      else {
          if (typeof hostDialog.showModal === "function") {
              hostDialog.showModal()


          }


      }

        
    }

    // connect to players
    peer.on("connection", (conn) => {
        conn.on("open", () => {
            // data comes from the player, processed by the host
            conn.on("data", (data) => {
                const payload = data.payload

                console.debug("data", data)
                switch(data.action){
                    case "ping":
                        console.debug("connection started...", payload)
                        break

                    case "remove_user":
                        console.debug("User informs host they're leaving", payload)
                        state.users       = dissoc(payload.name, state.users)
                        state.connections = dissoc(payload.name, state.connections)

                        console.debug("state", state)

                        forEach((conn) => {
                            console.debug("send user list to all players")
                            console.debug("conn", conn)
                            conn.send({action: 'refresh_users', payload: state.users})
                        }, values(state.connections))
                        listPlayers()
                        break;

                    case "reveal_vote":
                        console.debug("Counting votes")

                        state.users[payload.name].vote = payload.vote
                        const voteCountExpected = mapAccum((acc, user) => {
                            const voted = user.voted ? 1: 0
                            return [acc + voted, voted]
                        }, 0, values(state.users))
                        console.debug("voteCountExpected", voteCountExpected)

                        const voteCountActual = mapAccum((acc, user) => {
                            const vote = user.vote ? 1: 0
                            return [acc + vote, vote]


                        }, 0, values(state.users))

                        if (voteCountActual[0] === voteCountExpected[0]) {
                           revealVotes() 
                        }


                        break
                    case "user_voted":
                        console.debug("new user added to host!", payload)
                        state.users[payload.name].voted = true

                        forEach((conn) => {
                            console.debug("send user list to all players")
                            console.debug("conn", conn)
                            conn.send({action: 'refresh_users', payload: state.users})
                        }, values(state.connections))


                        listPlayers()
                        break

                    case "add_user":
                        console.debug("new user added to host!", payload)
                        const key = payload.was ?? payload.name
                        delete state.connections[key] 
                        delete state.users[key] 


                        state.users[payload.name] = { voted: false, details: payload}
                        state.connections[payload.name] = conn

                        forEach((conn) => {
                            console.debug("send user list to all players")
                            console.debug("conn", conn)
                            conn.send({action: 'refresh_users', payload: state.users})
                        }, values(state.connections))

                        conn.send({action: 'initalize_game', payload: state.game})

                        if (values(state.users).length > 1 && state.game.mode === GameModes.wait) {
                            initalizeGame()
                            
                        }

                        listPlayers()
                        break
                    default:
                        console.log("default")
                        break
                }


            })

            conn.send({action: 'ping', payload: "Welcome!"})

           
        
        })
    
    })

    // connect to host
    if (hostId) {
        const conn = peer.connect(hostId);
        state.host.conn = conn
        console.debug("conn", conn)
        console.debug("hostId", hostId)

        conn.on('open', () => {
            userDialog.addEventListener('close',(e) => {

              main.children["host-loading"].classList.add("hidden")

              if (userDialog.returnValue === "" || userDialog.returnValue === "cancel") {
                return 
              }
              
              console.debug("closeing", e)
              console.debug("userDialog.returnValue", userDialog.returnValue)
              const userForm = e.target.firstElementChild
              const userInfo = new FormData(userForm)
              const user = {}
              userInfo.forEach((value, key) => (user[key] = value))
              localStorage.setItem("user", JSON.stringify(user))

              console.debug("userInfo", userInfo)

              console.debug("user", user)

              state.theme.name = user.theme
              setTheme()

              conn.send({action: "add_user", payload: { was: clone(state.me.name), ...user }})

              state.me = user


              listPlayers()
              forEach((conn) => {
                console.debug("send user list to all players")
                console.debug("conn", conn)
                conn.send({action: 'refresh_users', payload: state.users})
              }, values(state.connections))


            })

            if (typeof userDialog.showModal === "function") {

                const user = JSON.parse(localStorage.getItem("user"))
                if (user) {
                    conn.send({action: "add_user", payload: user})
                    state.me = user
                    state.theme.name = user.theme
                    setTheme()

                }
                else {
                    userDialog.showModal()
                }

                
            }
            window.addEventListener("beforeunload", (event) => {
                event.returnValue = ""
               conn.send({action: "remove_user", payload: state.me})
                return null
            
            })

            // Send from host to Player
            conn.on("data", (data) => {
                console.debug("From Host", data)
                const payload = data.payload

                console.debug("data", data)
                switch(data.action){
                    case "ping":
                        console.debug("Host says hello", payload)
                        break
                    case "refresh_users":
                        console.debug("new users!", payload)
                        state.users = payload 
                        listPlayers()
                        break

                    case "show_results":

                        showResults(payload.votes, payload.average)
                        break


                    case "restart_game":
                        state.me = omit(["votes", "vote"], state.me)
                        state.el.main.children[state.game.type].children["results"].innerHTML = ""

                        break
                    case "reveal_vote":

                        conn.send({action: "reveal_vote", payload: {
                            name: state.me.name,
                            vote: state.me.vote
                        }})
                        break
                    case "add_user":
                        console.debug("new user!", payload)
                        state.users[payload.name] = { voted: false, details: payload }
                        listPlayers()
                        break
                    case "initalize_game":
                        state.game.type = payload.type
                        initalizeGame()
                        break
                    default:
                        console.log("default")
                        break
                }
            })
            conn.send({action: "ping", payload: "I've arrived!"})

        })

    }

    if (typeof hostDialog.showModal !== 'function') {
        hostDialog.hidden = true

    }

    if (typeof userDialog.showModal !== 'function') {
        userDialog.hidden = true
    }




})
