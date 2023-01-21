// # Imports
import {map, mapObjIndexed, groupBy, dissoc, forEach, values} from 'ramda'
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
    me: {

    },
    elements : {

    }, 
    connections: {

    },
    users : {

    }, 
    
    
}

// # Funcs

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
                li.innerText = user.details.name
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

    console.debug(`My peer ID is ${id}` )

    const shareButton = document.getElementById("share-copy")
    shareButton.addEventListener('click', (event) => {
        navigator.clipboard.writeText(`${location.origin}?hostId=${id}`)
    })


    const main = document.getElementById("content")
    if (hostId) {
        // You aren't the host
        main.innerHTML =  "Connecting..."
    } else {
        // You are the host
        const user = JSON.parse(localStorage.getItem("host"))
        if (user) {
            state.users[user.name] = { details: user }
            state.me = user
            listUsers()
            main.innerHTML = "Waiting for users to connect..."


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

                    state.users[user.name] = { details: user }
                    state.me = user


                    main.innerHTML = "Waiting for users to connect..."


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

                    case "add_user":
                        console.debug("new user added to host!", payload)
                        state.users[payload.name] = { details: payload}
                        state.connections[payload.name] = conn

                        forEach((conn) => {
                            console.debug("send user list to all players")
                            console.debug("conn", conn)
                            conn.send({action: 'refresh_users', payload: state.users})
                        }, values(state.connections))


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

                    case "add_user":
                        console.debug("new user!", payload)
                        state.users[payload.name] = { details: payload }
                        listUsers()
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


