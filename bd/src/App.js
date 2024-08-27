import { useState, useEffect } from 'react';
import { db } from './firebaseConnection'; // auth não está sendo utilizado

import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState(''); // Corrigido para idPost
  const [post, setPost] = useState([]);

  useEffect(() => {
    // Função para carregar posts em tempo real
    const carregarPosts = () => {
      const unsubscribe = onSnapshot(collection(db, "posts"), (snapshot) => {
        let listaPost = [];
        snapshot.forEach((doc) => {
          listaPost.push({
            id: doc.id,
            titulo: doc.data().titulo,
            autor: doc.data().autor
          });
        });
        setPost(listaPost);
      });

      // Cleanup function to unsubscribe from the listener
      return () => unsubscribe();
    };

    carregarPosts();
  }, []);

  // C - Create
  const adicionarPosts = async () => {
    try {
      await addDoc(collection(db, "posts"), { titulo, autor });
      alert("Cadastro realizado com sucesso!");
      setAutor('');
      setTitulo('');
    } catch (error) {
      console.log(error);
    }
  };

  // R - Read
  const buscarPosts = async () => {
    try {
      const snapshot = await getDocs(collection(db, "posts"));
      const lista = snapshot.docs.map((doc) => ({
        id: doc.id,
        titulo: doc.data().titulo,
        autor: doc.data().autor
      }));
      setPost(lista);
    } catch (error) {
      console.log(error);
    }
  };

  // U - Update
  const editarPost = async () => {
    try {
      const postRef = doc(db, "posts", idPost); // Corrigido para "posts"
      await updateDoc(postRef, { titulo, autor });
      alert("Post editado com sucesso!");
      setIdPost('');
      setTitulo('');
      setAutor('');
    } catch (error) {
      console.log(error);
    }
  };

  // D - Delete
  const excluirPost = async (id) => {
    try {
      const postRef = doc(db, "posts", id); // Corrigido para "posts"
      await deleteDoc(postRef);
      alert("Post deletado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>ReactJs + Firebase</h1>

      <h2>POSTS</h2>
      <label>ID do Post</label>
      <input 
        placeholder="ID do post"
        value={idPost}
        onChange={(e) => setIdPost(e.target.value)} 
      />

      <label>Título:</label>
      <textarea
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
      />
      <label>Autor:</label>
      <input
        type="text"
        placeholder="Autor do post"
        value={autor}
        onChange={(e) => setAutor(e.target.value)}
      />
      <button onClick={adicionarPosts}>Inserir</button>
      <button onClick={buscarPosts}>Buscar</button>
      <button onClick={editarPost}>Editar</button>

      <ul>
        {post.map((value) => (
          <li key={value.id}>
            <strong>ID: {value.id}</strong>
            <span>Título: {value.titulo}</span>
            <span>Autor: {value.autor}</span>
            <button onClick={() => excluirPost(value.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
