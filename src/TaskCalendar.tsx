    import { useState } from "react";
    import type { Tarea } from "./useTareas";
    import "./styles/TaskCalendar.css";

    interface Props {
    tareas: Tarea[];
    }

    const DIAS_SEMANA = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const MESES = [
    "Enero","Febrero","Marzo","Abril","Mayo","Junio",
    "Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre",
    ];

    function isSameDay(a: Date, b: Date): boolean {
    return (
        a.getDate()     === b.getDate() &&
        a.getMonth()    === b.getMonth() &&
        a.getFullYear() === b.getFullYear()
    );
    }

    export default function TaskCalendar({ tareas }: Props) {
    const hoy = new Date();
    const [mes, setMes]   = useState(hoy.getMonth());
    const [anio, setAnio] = useState(hoy.getFullYear());
    const [hoveredDay, setHoveredDay] = useState<number | null>(null);

    // Navegar meses
    const prevMes = () => {
        if (mes === 0) { setMes(11); setAnio(anio - 1); }
        else setMes(mes - 1);
    };
    const nextMes = () => {
        if (mes === 11) { setMes(0); setAnio(anio + 1); }
        else setMes(mes + 1);
    };

    // Primer día del mes y total de días
    const primerDia    = new Date(anio, mes, 1).getDay();
    const diasEnMes    = new Date(anio, mes + 1, 0).getDate();

    // Tareas con fecha de entrega en este mes
    const tareasDelMes = tareas.filter((t) => {
    const fecha = t.fechaEntrega ? new Date(t.fechaEntrega) : new Date(t.fechaHora);
    return fecha.getMonth() === mes && fecha.getFullYear() === anio;
    });

    // Obtener tareas de un día específico
        const tareasDelDia = (dia: number): Tarea[] => {
    const fechaDelDia = new Date(anio, mes, dia);
    return tareasDelMes.filter((t) => {
        const fechaTarea = t.fechaEntrega
        ? new Date(t.fechaEntrega)
        : new Date(t.fechaHora);
        return isSameDay(fechaTarea, fechaDelDia);
    });
    };

    // Determinar clase CSS del día
    const claseDia = (dia: number): string => {
        const fecha  = new Date(anio, mes, dia);
        const tareas = tareasDelDia(dia);
        const clases = ["cal-day"];

        if (isSameDay(fecha, hoy)) clases.push("today");

        if (tareas.length > 0) {
        const tienePrioridad = tareas.some((t) => t.estado === "prioridad");
        const tienePerdida   = tareas.some((t) => t.estado === "perdida");

        if (tienePrioridad) clases.push("has-priority");
        else if (tienePerdida) clases.push("has-lost");
        else clases.push("has-tasks");
        }

        return clases.join(" ");
    };

    // Celdas vacías al inicio + días del mes
    const celdas: (number | null)[] = [
        ...Array(primerDia).fill(null),
        ...Array.from({ length: diasEnMes }, (_, i) => i + 1),
    ];

    // Contar tareas con prioridad este mes
    const conPrioridad = tareasDelMes.filter((t) => t.estado === "prioridad").length;
    const conEntrega   = tareasDelMes.length;

    return (
        <div className="calendar-wrapper">
        {/* HEADER */}
        <div className="calendar-header">
            <div>
            <p className="calendar-title">Calendario</p>
            <p className="calendar-subtitle">
                {conEntrega} tarea{conEntrega !== 1 ? "s" : ""} este mes
                {conPrioridad > 0 && ` · ${conPrioridad} urgente${conPrioridad !== 1 ? "s" : ""}`}
            </p>
            </div>
            <div className="calendar-nav">
            <button className="cal-nav-btn" onClick={prevMes} title="Mes anterior">‹</button>
            <span className="cal-month-label">{MESES[mes]} {anio}</span>
            <button className="cal-nav-btn" onClick={nextMes} title="Mes siguiente">›</button>
            </div>
        </div>

        {/* GRID */}
        <div className="calendar-grid">
            {/* Nombres de días */}
            {DIAS_SEMANA.map((d) => (
            <div key={d} className="cal-day-name">{d}</div>
            ))}

            {/* Celdas */}
            {celdas.map((dia, idx) => {
            if (dia === null) {
                return <div key={`empty-${idx}`} className="cal-day empty" />;
            }

            const tareasDia   = tareasDelDia(dia);
            const tieneTareas = tareasDia.length > 0;

            return (
                <div
                key={dia}
                className={claseDia(dia)}
                onMouseEnter={() => tieneTareas ? setHoveredDay(dia) : null}
                onMouseLeave={() => setHoveredDay(null)}
                >
                {dia}
                {tieneTareas && <span className="cal-dot" />}

                {/* Tooltip */}
                {hoveredDay === dia && tieneTareas && (
                    <div className="cal-tooltip">
                    <p className="tooltip-title">
                        {dia} de {MESES[mes]}
                    </p>
                    {tareasDia.map((t) => (
                        <div key={t.id} className="tooltip-task">
                        <span
                            className="tooltip-task-dot"
                            style={{
                            background:
                                t.estado === "prioridad" ? "var(--danger)"
                                : t.estado === "perdida"  ? "var(--muted)"
                                : "var(--accent)",
                            }}
                        />
                        {t.titulo}
                        </div>
                    ))}
                    </div>
                )}
                </div>
            );
            })}
        </div>

        {/* LEYENDA */}
        <div className="calendar-legend">
            <div className="legend-item">
            <span className="legend-dot today" />
            Hoy
            </div>
            <div className="legend-item">
            <span className="legend-dot normal" />
            Con tarea
            </div>
            <div className="legend-item">
            <span className="legend-dot priority" />
            Urgente (&lt;24h)
            </div>
        </div>
        </div>
    );
    }