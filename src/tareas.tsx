// src/tareas.tsx
import { useEffect } from "react";
import { useTareas } from "./useTareas";
import './tareas.css';

function Tareas() {
  const {
    tareas,
    modalAbierto,
    titulo,
    descripcion,
    error,
    setTitulo,
    setDescripcion,
    abrirModal,
    cerrarModal,
    crearTarea,
    eliminarTarea,
    formatearFecha,
  } = useTareas();

  useEffect(() => {
    document.title = "MyTask - Tareas";
  }, []);

  return (
    <>
      <section className="tareas-page">
        <div className="tareas-container">
          <div className="tareas-header">
            <h1>Mis <span>Tareas</span></h1>
            <button className="btn-nueva-tarea" onClick={abrirModal}>
              + Nueva Tarea
            </button>
          </div>

          {tareas.length === 0 ? (
            <p className="tareas-empty">No tienes tareas aún. ¡Crea una!</p>
          ) : (
            <div className="tareas-lista">
              {tareas.map((tarea) => (
                <div className="tarea-card" key={tarea.id}>
                  <div className="tarea-card-header">
                    <h3 className="tarea-titulo">{tarea.titulo}</h3>
                    <span className="tarea-fecha">{formatearFecha(tarea.fechaHora)}</span>
                  </div>
                  <p className="tarea-descripcion">{tarea.descripcion}</p>
                  <div className="tarea-card-footer">
                    <button
                      className="btn-finalizar"
                      onClick={() => eliminarTarea(tarea.id)}
                    >
                      ✓ Finalizar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {modalAbierto && (
        <div className="modal-overlay" onClick={cerrarModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Nueva <span>Tarea</span></h2>
              <button className="modal-close" onClick={cerrarModal}>✕</button>
            </div>

            <div className="modal-body">
              <div className="field">
                <label htmlFor="titulo">Título</label>
                <input
                  id="titulo"
                  type="text"
                  placeholder="Nombre de la tarea"
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                />
              </div>

              <div className="field">
                <label htmlFor="descripcion">Descripción</label>
                <textarea
                  id="descripcion"
                  placeholder="Describe la tarea..."
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  rows={4}
                />
              </div>

              {error && <p className="modal-error">⚠ {error}</p>}
            </div>

            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModal}>Cancelar</button>
              <button className="btn-crear" onClick={crearTarea}>Crear Tarea</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tareas;