// src/tareas.tsx
import { useEffect } from "react";
import { useTareas } from "./useTareas";
import type { Tarea } from "./useTareas";
import { useAuth } from "./Routes/UseAuth";
import './styles/tareas.css';

function Tareas() {
  const { user } = useAuth(); 
  const {
    tareas,
    modalAbierto,
    titulo,
    descripcion,
    fechaEntrega,
    error,
    setTitulo,
    setDescripcion,
    setFechaEntrega,
    abrirModal,
    cerrarModal,
    crearTarea,
    eliminarTarea,
    formatearFecha,
    completarTarea,
    modalEditar,
    tituloEditar,
    descripcionEditar,
    fechaEntregaEditar,
    errorEditar,
    setTituloEditar,
    setDescripcionEditar,
    setFechaEntregaEditar,
    abrirModalEditar,
    cerrarModalEditar,
    guardarEdicion,
  } = useTareas(user?.correo ?? "");

  useEffect(() => {
    document.title = "MyTask - Tareas";
  }, []);

  const etiquetaEstado = (tarea: Tarea) => {
    if (tarea.estado === "completada") return <span className="badge badge-completada">✓ Completada</span>;
    if (tarea.estado === "prioridad") return <span className="badge badge-prioridad">⚠ Prioridad</span>;
    if (tarea.estado === "perdida") return <span className="badge badge-perdida">✕ Tarea Perdida</span>;
    return <span className="badge badge-normal">● Activa</span>;
  };

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
              {tareas.map((tarea: Tarea) => (
                <div
                  className={`tarea-card tarea-card--${tarea.estado}`}
                  key={tarea.id}
                >
                  <div className="tarea-card-header">
                    <div className="tarea-card-titulo-row">
                      <h3 className="tarea-titulo">{tarea.titulo}</h3>
                      {etiquetaEstado(tarea)}
                    </div>
                    <span className="tarea-fecha">Creada: {formatearFecha(tarea.fechaHora)}</span>
                  </div>

                  <p className="tarea-descripcion">{tarea.descripcion}</p>

                  {tarea.fechaEntrega && (
                    <p className="tarea-entrega">
                      🕐 Entrega: {formatearFecha(tarea.fechaEntrega)}
                    </p>
                  )}

                <div className="tarea-card-footer">
                  {/* Botón completar — solo si no está completada ni perdida */}
                  {tarea.estado !== "completada" && tarea.estado !== "perdida" && (
                    <button
                      onClick={() => completarTarea(tarea.id)}
                      className="btn-completar"
                    >
                      Marcar como hecha
                    </button>
                  )}

                  {tarea.estado !== "completada" && tarea.estado !== "perdida" && (
                  <button className="btn-editar" onClick={() => abrirModalEditar(tarea)}>
                    ✎ Editar
                  </button>
                )}

                  {/* Botón eliminar — solo si está completada o perdida */}
                  {(tarea.estado === "completada" || tarea.estado === "perdida") && (
                    <button className="btn-eliminar" onClick={() => eliminarTarea(tarea.id)}>
                      ✕ Eliminar
                    </button>
                  )}
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

              <div className="field">
                <label htmlFor="fechaEntrega">Fecha y hora de entrega <span className="label-opcional">(opcional)</span></label>
                <input
                  id="fechaEntrega"
                  type="datetime-local"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
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

      {/* MODAL EDITAR */}
      {modalEditar && (
        <div className="modal-overlay" onClick={cerrarModalEditar}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar <span>Tarea</span></h2>
              <button className="modal-close" onClick={cerrarModalEditar}>✕</button>
            </div>
            <div className="modal-body">
              <div className="field">
                <label htmlFor="tituloEditar">Título</label>
                <input
                  id="tituloEditar"
                  type="text"
                  value={tituloEditar}
                  onChange={(e) => setTituloEditar(e.target.value)}
                />
              </div>
              <div className="field">
                <label htmlFor="descripcionEditar">Descripción</label>
                <textarea
                  id="descripcionEditar"
                  value={descripcionEditar}
                  onChange={(e) => setDescripcionEditar(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="field">
                <label htmlFor="fechaEntregaEditar">Fecha y hora de entrega <span className="label-opcional">(opcional)</span></label>
                <input
                  id="fechaEntregaEditar"
                  type="datetime-local"
                  value={fechaEntregaEditar}
                  onChange={(e) => setFechaEntregaEditar(e.target.value)}
                />
              </div>
              {errorEditar && <p className="modal-error">⚠ {errorEditar}</p>}
            </div>
            <div className="modal-footer">
              <button className="btn-cancelar" onClick={cerrarModalEditar}>Cancelar</button>
              <button className="btn-crear" onClick={guardarEdicion}>Guardar cambios</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Tareas;