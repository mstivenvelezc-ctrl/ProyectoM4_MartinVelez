    import { useEffect } from "react";
    import './styles/Tareas.css';

    function Tareas() {
    useEffect(() => {
        document.title = "MyTask - Tareas";
    }, []);

    return (
        <>
        <section className="tareas-page">
            <div className="tareas-container">
            <h1>Mis <span>Tareas</span></h1>
            <p>Aquí irán tus tareas</p>
            </div>
        </section>
        </>
    );
    }

    export default Tareas;
