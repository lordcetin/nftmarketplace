import { initializeApp } from "firebase/app";
import { getAuth,signOut, updateProfile,createUserWithEmailAndPassword, onAuthStateChanged,signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";
import { userHandler } from "./userauth";
import { getFirestore,doc,setDoc,getDoc, updateDoc, arrayUnion,} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyBxizDXLmmI-0Ihf98w2_aPj6dp6cvUrw0",
  authDomain: "cosmeta-44d4b.firebaseapp.com",
  projectId: "cosmeta-44d4b",
  storageBucket: "cosmeta-44d4b.appspot.com",
  messagingSenderId: "623130640106",
  appId: "1:623130640106:web:4658af8dd0dc2961fee193"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const authorization = getAuth()
export const db = getFirestore(app)

onAuthStateChanged(authorization, async user => {
    if(user){
		const dbUser = await getDoc(doc(db,"users",user.uid))
		let data = {
		uid:user.uid,
		username:user.username,
		email:user.email,
		emailVerified:user.emailVerified,
		phone:user.phoneNumber,
		...dbUser.data()
		}
    userHandler(data)
    }else{
    userHandler(false)
    }
})

export const login = async (email,password) => {
    try {
       const response = await signInWithEmailAndPassword(authorization,email,password)
			 return response
    } catch (error) {
        toast.error(error.code)
    }
}


export const getUserInfo = async uname => {
	const username = await getDoc(doc(db,"usernames",uname))
	if(username.exists()){
		return (await getDoc(doc(db,"users",username.data().user_id))).data()
		
	}else{
		toast.error("User not found")
		throw new Error("User not found")
	}
}


export const register = async ({email,phone,password,username}) => {

		const users = await getDoc(doc(db,"usernames",username))
		if(users.exists()){
			toast.error(`${username} is already exist`)
		 }else{
       const response = await createUserWithEmailAndPassword(authorization,email,password,username)
       if(response.user){
			await setDoc(doc(db,"usernames",username), {
				user_id: response.user.uid
			})
        await setDoc(doc(db,"users",response.user.uid),{
			username: username,
			uid:response.user.uid,
			followers:[],
			following:[],
			notifications:[],
			website:'',
			walletAddress:'',
			bio:'',
			liked:[],
			commended:[],
			nfts:[],
			phone:phone,
			email:email,
			gender:'',
			avatar:'https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-image-182145777.jpg',
			banner:'https://bafybeihkjdaxrbzc37aqro7x5ggttlor6fbo3fbtv5zb3p4seiwyzxcqmi.ipfs.nftstorage.link',
			posts:0,
			root:false,
        }).then(() => {
			console.log("")
		}).catch(error => console.log(error))
		
    return response.user
		}
			}

}

export const followers = async (follower,followed) => {
	await updateDoc(doc(db,'users',followed),{
		followers: arrayUnion(follower)
	})
}

export const unfollow = async (follower,followed) => {
	if(response.user.uid == follower){
		await updateDoc(doc(db,'users',followed),{
			followers: arrayRemove(follower)
		})
	}
}


export const logout = async () => {
    try {
        await signOut(authorization)
    } catch (err) {
        toast.error(err.code)
    }
}
