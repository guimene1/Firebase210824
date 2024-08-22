import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection';

import {
  doc,
  setDoc,
  collection,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idpost, setIdpost] = useState('');

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [post, setPost] = useState([]);

  useEffect(() => {
    async function carregarPosts() {
      const dados = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];

        snapshot.forEach((doc) => {
          listaPost.push(
            {
              id: doc.id,
              titulo: doc.data().titulo,
              autor: doc.data().autor
            }
          );
        })
        setPost(listaPost);
      })
    }
    carregarPosts();
  }, [])

  //C - create
  async function adicionarPosts() {
    await addDoc(collection(db, "posts"), {
      titulo: titulo,
      autor: autor,
    }).then(() => {
      alert("Cadastro realizado com sucesso!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!")
      setAutor('');
      setTitulo('');
    }).catch((error) => {
      console.log(error);
    })
  }
  //R - read
  async function buscarPosts() {
    const config = collection(db, "posts");
    await getDocs(config).then((snapshot) => {
      let lista = [];

      snapshot.forEach((doc) => {
        lista.push(
          {
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          }
        );
      });

      setPost(lista);

    }).catch((error) => {
      console.log(error);
    })
  }

  //U - update
  async function editarPost() {
    const postEditado = doc(db, "post", idPost);

    await updateDoc(postEditado, {
      titulo: titulo,
      autor: autor
    }).then(() => {
      alert("Post editado com sucesso!")
      setIdpost('');
      setTitulo('');
      setAutor('');
    }).catch((error) => {
      console.log(error);
    })
  }

  //D - delete
  async function excluirPost() {
    const postDeletado = doc(db, "posts", id);
    await deleteDoc(docRef).then(()=>{
      alert("Post deletado com sucesso!")
    }).catch((error) => {
      console.log(error);
    })
  }
}
