
import  React from 'react';
import './App.css';

function About(): React.ReactElement {
    return (
        <div className="about-page">
        <div className="about-container">
            <h1>Acerca de <span>MyTask</span></h1>
            <p className="about-intro">
            MyTask es una aplicación moderna de gestión de tareas diseñada para ayudarte a organizar tu día de manera eficiente.
            </p>
            
            <section className="about-section">
            <h2>¿Quiénes somos?</h2>
            <p>
                Somos un equipo de desarrolladores apasionados por crear herramientas que simplifiquen la vida de las personas. 
                MyTask nace de la necesidad de tener una plataforma intuitiva y moderna para gestionar tareas diarias.
            </p>
            </section>

            <section className="about-section">
            <h2>Nuestra misión</h2>
            <p>
                Proporcionar a los usuarios una experiencia excepcional en la gestión de tareas, 
                combinando diseño moderno con funcionalidad robusta.
            </p>
            </section>

            <section className="about-section">
            <h2>Tecnología</h2>
            <p>
                Construida con React y TypeScript, MyTask aprovecha las últimas tecnologías web 
                para garantizar rendimiento, seguridad y escalabilidad.
            </p>
            </section>
        </div>
        </div>
    );
    }

    export default About;