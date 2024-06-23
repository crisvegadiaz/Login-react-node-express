import { useEffect } from 'react';
import '../styles/mensaje.css';

function Mensaje(){
  useEffect(() => {
    const container = document.querySelector('.container');
    const colors = ['#8EECFA', '#8EFAC0', '#8EFAE4', '#1289F8'];

    const figures = () => {
      for (let i = 0; i <= 25; i++) {
        let figure = document.createElement('span');
        let select = Math.round(colors.length * Math.random());

        figure.style.top = window.innerHeight * Math.random() + 'px';
        figure.style.left = window.innerWidth * Math.random() + 'px';
        figure.style.background = colors[select >= colors.length ? select - 1 : select];

        container.appendChild(figure);

        setInterval(() => {
          figure.style.top = window.innerHeight * Math.random() + 'px';
          figure.style.left = window.innerWidth * Math.random() + 'px';
        }, 5000);
      }
    };

    figures();
  }, []);

  return (
    <section className="container">
      <h1>Hola Mundo 🌎</h1>
    </section>
  );
}

export default Mensaje;

