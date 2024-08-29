import { useState, useEffect } from 'react';
import { db, auth } from './firebaseConnection'; // Adicione auth aqui

import {
  doc,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  onSnapshot
} from 'firebase/firestore';
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // Adicione signOut aqui

function App() {
  const [titulo, setTitulo] = useState('');
  const [autor, setAutor] = useState('');
  const [idPost, setIdPost] = useState('');
  const [post, setPost] = useState([]);

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const [usuario, setUsuario] = useState(false); // Inicialize como false
  const [detalhesUsuario, setDetalhesUsuario] = useState({})

  useEffect(() => {
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

      return () => unsubscribe();
    };

    carregarPosts();
  }, []);

  useEffect(() => {
    async function verificarLogin() {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          //Tem usuario logado
          setUsuario(true);
          setDetalhesUsuario({
            uid: user.uid,
            email: user.email
          })
        } else {
          //Não possui usuario logado
          setUsuario(false);
          setDetalhesUsuario({});
        }
      })
    }
    verificarLogin();
  }, [])

  async function novoUsuario() {
    createUserWithEmailAndPassword(auth, email, senha)
      .then(() => {
        alert("Usuário cadastrado com sucesso!")
        setEmail("");
        setSenha("");
      }).catch((error) => {
        if (error.code === 'auth/weak-password') {
          alert("Senha muito fraca")
        } else if (error.code === 'auth/email-already-in-use') {
          alert("Email já existe!")
        }
      })
  }

  async function logarUsuario() {
    await signInWithEmailAndPassword(auth, email, senha)
      .then((value) => {
        alert("Usuário logado com sucesso!")
        setUsuario(true);
        setDetalhesUsuario({
          uid: value.user.uid,
          email: value.user.email
        });
        setEmail("");
        setSenha("");
      })
      .catch(() => {
        alert("Erro ao fazer o login")
      })
  }

  async function fazerLogout() {
    await signOut(auth) // Corrigido para utilizar signOut
    setUsuario(false)
    setDetalhesUsuario({})
  }

  // C - Create
  const adicionarPosts = async () => {
    try {
      await addDoc(collection(db, "posts"), { titulo, autor });
      alert("Post realizado com sucesso!");
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
      const postRef = doc(db, "posts", idPost);
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
      const postRef = doc(db, "posts", id);
      await deleteDoc(postRef);
      alert("Post deletado com sucesso!");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>ReactJs + Firebase</h1>
      {usuario && (
        <div>
          <strong>Seja bem vindo(a)</strong>
          <br/>
          <span>ID: {detalhesUsuario.uid}</span>
          <br/>
          <span>Email: {detalhesUsuario.email}</span>
          <br/>
          <button onClick={fazerLogout}>Sair</button>
          </div>
      )}

      <h2>Usuários</h2>

      <label>Email:</label>
      <input
        type="email"
        placeholder="Digite um email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <label>Senha:</label>
      <input
        type="password"
        placeholder="Digite uma senha"
        value={senha}
        onChange={(e) => setSenha(e.target.value)}
      />

      <button onClick={novoUsuario}>Cadastrar</button>
      <button onClick={logarUsuario}>Login</button>

      <hr/>

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
