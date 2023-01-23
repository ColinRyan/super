// # Imports

import {omit, sum, mapAccum, map, mapObjIndexed, groupBy, dissoc, forEach, values} from 'ramda'
import {Peer} from 'peerjs'


const params = new Proxy(new URLSearchParams(window.location.search), {
  get: (searchParams, prop) => searchParams.get(prop),
});
// Get the value of "some_key" in eg "https://example.com/?some_key=some_value"

const peer = new Peer()

const userDialog = document.getElementById("user-info-dialog")
const hostDialog = document.getElementById("host-info-dialog")
const userList = document.getElementById("users")


// # Local State

const state = {
    host: {
        conn: null

    },
    me: {

    },
    el: {
        main: document.getElementById("content")

    }, 
    connections: {

    },
    users : {

    }, 
    game: {
        type: "story-pointing"

    },
    matches: [

    ],


    
    
}

window.state = state
window.main = state.el.main

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
        listUsers()
        forEach((conn) => {
            console.debug("time to reveal all votes")
            conn.send({action: 'restart_game', payload: true})
            conn.send({action: 'refresh_users', payload: state.users})

        }, values(state.connections))

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

      return
      
  }

  state.me.voted = true
  state.me.vote  = el.value

  console.debug("state.me", state.me)
  if (state.me.category !== "host") {
      state.host.conn.send({action: "user_voted", payload: {name: state.me.name}})
  }
  else {

      state.users[state.me.name].voted = true

      listUsers()

      forEach((conn) => {
          console.debug("send user list to all players")
          console.debug("conn", conn)
          conn.send({action: 'refresh_users', payload: state.users})
      }, values(state.connections))


  }

 

})

// # Funcs

const showResults = (votes, average) => {
    const main = state.el.main
    const game = main.children[state.game.type]
    const results = game.children.results
   

    results.append(`average: ${average}`)
    results.append(`votes: ${votes}`)


}

const revealVotes =  () => {
   const votes = map((user) => {
       return user.vote
   }, values(state.users))

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



}


const initalizeGame = () => {

    const main = state.el.main
    forEach((el) => {
       el.classList.add("hidden")
    
    },main.children)

    const game = main.children[state.game.type]
    game.classList.toggle("hidden")

    if (state.me.category === "host") {
        game.children["reveal"].classList.toggle("hidden")
        
    }



} 

const listUsers = () => {
    

    userList.innerHTML = ""
    console.debug("state", state)
    console.debug("values(state.users)", values(state.users))
    const usersByCategory = groupBy((user) => {
       return user.details.category
    
    }, values(state.users))

    const userLists = mapObjIndexed((users, category) => {
            const figure = document.createElement("figure")
            const figCaption = document.createElement("figcaption")
            figCaption.innerText = category
            figure.appendChild(figCaption)
            const ul = document.createElement("ul")

            const listItems = map((user) => {
                const li = document.createElement("li")
                li.innerText = `${user.details.name}${user.voted ? " 🗹": " ☐"}`
                return li
            }, users)
            
            ul.append(...listItems)
            figure.appendChild(ul)
            return figure




            
       
    
    }, usersByCategory )
    console.debug("userLists", userLists)

    userList.append( "Players", ...values(userLists))
   

}




peer.on('open', (id) => {



    const hostId = params.hostId; 
    const main = state.el.main

    console.debug(`My peer ID is ${id}` )

    const shareButton = document.getElementById("share-copy")
    shareButton.addEventListener('click', (event) => {
        navigator.clipboard.writeText(`${location.origin}?hostId=${id}`)
    })


    if (hostId) {
        // You aren't the host
        main.children["players-loading"].classList.toggle("hidden")
    } else {
        // You are the host
        const user = JSON.parse(localStorage.getItem("host"))
        if (user) {
            state.users[user.name] = { voted: false, details: user }
            state.me = user
            listUsers()
            console.debug("main", main)
            main.children["host-loading"].classList.toggle("hidden")


        }
        else {
            if (typeof hostDialog.showModal === "function") {
                hostDialog.showModal()
                hostDialog.addEventListener('close',(e) => {
                    console.debug("e", e)
                    console.debug("userDialog.returnValue", hostDialog.returnValue)
                    const hostForm = e.target.firstElementChild
                    const hostInfo = new FormData(hostForm)
                    const user = {}
                    hostInfo.forEach((value, key) => (user[key] = value))
                    console.debug("hostInfo", hostInfo)

                    localStorage.setItem("host", JSON.stringify(user))

                    state.users[user.name] = { voted: false, details: user }
                    state.me = user


                    main.children["host-loading"].classList.toggle("hidden")



                    listUsers()


                })


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
                        listUsers()
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


                        listUsers()
                        break

                    case "add_user":
                        console.debug("new user added to host!", payload)
                        state.users[payload.name] = { voted: false, details: payload}
                        state.connections[payload.name] = conn

                        forEach((conn) => {
                            console.debug("send user list to all players")
                            console.debug("conn", conn)
                            conn.send({action: 'refresh_users', payload: state.users})
                        }, values(state.connections))

                        conn.send({action: 'initalize_game', payload: state.game})

                        if (values(state.users).length > 1) {
                            initalizeGame()
                            
                        }

                        listUsers()
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
            if (typeof userDialog.showModal === "function") {

                const user = JSON.parse(localStorage.getItem("user"))
                if (user) {
                    conn.send({action: "add_user", payload: user})
                    state.me = user

                }
                else {
                    userDialog.showModal()
                    userDialog.addEventListener('close',(e) => {
                        console.debug("e", e)
                        console.debug("userDialog.returnValue", userDialog.returnValue)
                        const userForm = e.target.firstElementChild
                        const userInfo = new FormData(userForm)
                        const user = {}
                        userInfo.forEach((value, key) => (user[key] = value))
                        localStorage.setItem("user", JSON.stringify(user))

                        console.debug("userInfo", userInfo)

                        state.me = user
                        conn.send({action: "add_user", payload: user})

                        listUsers()
                    })



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
                        listUsers()
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
                        listUsers()
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
