import locale
import pandas as pd
import plotly.express as px
from flask import Flask, render_template_string
from dash import Dash, dcc, html as dash_html
from dash.dependencies import Input, Output
import plotly.graph_objects as go
from datetime import datetime, timedelta
import calendar
import psycopg2
from psycopg2 import extras
from psycopg2 import pool
import functools

pd.set_option('future.no_silent_downcasting', True)

try:
    locale.setlocale(locale.LC_TIME, 'es_ES.UTF-8')
except locale.Error:
    try:
        locale.setlocale(locale.LC_TIME, 'es_ES')
    except locale.Error:
        print("Advertencia: No se pudo configurar el locale 'es_ES.UTF-8' o 'es_ES'. Los nombres de los meses podrían no estar en español.")

NEON_DB_HOST = "ep-soft-hill-a58y8rpi-pooler.us-east-2.aws.neon.tech"
NEON_DB_NAME = "neondb"
NEON_DB_USER = "neondb_owner"
NEON_DB_PASSWORD = "npg_zmwsAx7W3Rpa"
NEON_DB_PORT = "5432"

db_pool = None
try:
    db_pool = pool.ThreadedConnectionPool(
        minconn=1,
        maxconn=5,
        host=NEON_DB_HOST,
        database=NEON_DB_NAME,
        user=NEON_DB_USER,
        password=NEON_DB_PASSWORD,
        port=NEON_DB_PORT,
        sslmode='require'
    )
    print("Pool de conexiones a la base de datos inicializado exitosamente.")
except Exception as e:
    print(f"Error al inicializar el pool de conexiones: {e}")

server = Flask(__name__)
app = Dash(__name__, server=server, url_base_pathname='/dashboard/')

COLOR_APROBADO = '#28a745'
COLOR_RECHAZADO = '#dc3545'
COLOR_PENDIENTE = '#ffc107'
COLOR_PRINCIPAL_TEXTO = '#212529'
COLOR_SECUNDARIO_TEXTO = '#6c757d'
COLOR_FONDO_CLARO = '#ffffff'
COLOR_FONDO_GENERAL = '#f8f9fa'
COLOR_AZUL_LINEA = '#007bff'
FONT_FAMILY_PRINCIPAL = 'Roboto, sans-serif'
FONT_FAMILY_SECUNDARIA = 'Open Sans, sans-serif' 

PANEL_STYLE = {
    'backgroundColor': COLOR_FONDO_CLARO,
    'borderRadius': '10px',
    'boxShadow': '0 4px 12px rgba(0, 0, 0, 0.08)',
    'padding': '25px',
    'margin': '15px',
    'flexGrow': 1
}

METRIC_CARD_STYLE = {
    'backgroundColor': COLOR_FONDO_CLARO,
    'borderRadius': '10px',
    'boxShadow': '0 4px 10px rgba(0, 0, 0, 0.06)',
    'padding': '20px 25px',
    'margin': '10px',
    'textAlign': 'left',
    'minWidth': '23%',
    'display': 'flex',
    'flexDirection': 'column',
    'justifyContent': 'space-between',
    'position': 'relative',
    'overflow': 'hidden',
    'borderLeft': f'5px solid {COLOR_AZUL_LINEA}'
}

DASHBOARD_TITLE_STYLE = {
    'color': COLOR_PRINCIPAL_TEXTO,
    'fontSize': '32px',
    'fontWeight': '700',
    'margin': '25px 20px 10px 20px',
    'textAlign': 'center',
    'fontFamily': FONT_FAMILY_PRINCIPAL
}

DASHBOARD_SUBTITLE_STYLE = {
    'color': COLOR_SECUNDARIO_TEXTO,
    'fontSize': '18px',
    'margin': '0 20px 30px 20px',
    'textAlign': 'center',
    'fontFamily': FONT_FAMILY_SECUNDARIA
}

def fetch_table(query):
    conn = None
    df = pd.DataFrame()
    if db_pool is None:
        print("ERROR: El pool de conexiones no está inicializado. No se puede ejecutar la consulta.")
        return df
    try:
        conn = db_pool.getconn()
        with conn.cursor(cursor_factory=extras.DictCursor) as cur:
            cur.execute(query)
            data = [dict(row) for row in cur.fetchall()]
            if data:
                df = pd.DataFrame(data)
            else:
                print(f"DEBUG: La consulta no devolvió datos: {query[:100]}...")
    except psycopg2.Error as e:
        print(f"Error al conectar o ejecutar consulta SQL a Neon: {e}")
        df = pd.DataFrame()
    finally:
        if conn:
            db_pool.putconn(conn)
    return df

@functools.lru_cache(maxsize=1)
def get_dashboard_data_and_figures_cached(timestamp_key):
    hoy = pd.Timestamp(timestamp_key)
    mes_anio_actual = hoy.strftime("%B %Y").capitalize()
    año_actual = hoy.year
    
    print(f"DEBUG: Ejecutando consultas SQL para datos del dashboard. Clave de caché: {timestamp_key}")

    query_metrics = f"""
    SELECT
        COALESCE(SUM(CASE WHEN estado_validacion = 'Rechazada' AND date_trunc('month', fecha_validacion) = date_trunc('month', '{timestamp_key}'::timestamp) THEN 1 ELSE 0 END), 0) AS rechazadas_current_month,
        COALESCE(SUM(CASE WHEN estado_validacion = 'Rechazada' AND date_trunc('month', fecha_validacion) = date_trunc('month', '{timestamp_key}'::timestamp - INTERVAL '1 month') THEN 1 ELSE 0 END), 0) AS rechazadas_prev_month,
        COALESCE(SUM(CASE WHEN estado_validacion = 'Validada' AND date_trunc('month', fecha_validacion) = date_trunc('month', '{timestamp_key}'::timestamp) THEN 1 ELSE 0 END), 0) AS aprobadas_current_month,
        COALESCE(SUM(CASE WHEN estado_validacion = 'Validada' AND date_trunc('month', fecha_validacion) = date_trunc('month', '{timestamp_key}'::timestamp - INTERVAL '1 month') THEN 1 ELSE 0 END), 0) AS aprobadas_prev_month,
        COALESCE(SUM(CASE WHEN estado_validacion = 'Pendiente' AND date_trunc('month', fecha_validacion) = date_trunc('month', '{timestamp_key}'::timestamp) THEN 1 ELSE 0 END), 0) AS pendientes_current_month
    FROM public.validaciones
    WHERE date_trunc('month', fecha_validacion) IN (date_trunc('month', '{timestamp_key}'::timestamp), date_trunc('month', '{timestamp_key}'::timestamp - INTERVAL '1 month'));
    """
    metrics_data = fetch_table(query_metrics)
    
    rechazadas_current_month, rechazadas_prev_month, rechazadas_delta = 0, 0, 0.0
    aprobadas_current_month, aprobadas_prev_month, aprobadas_delta = 0, 0, 0.0
    total_ongs_current_month, total_ongs_prev_month, total_ongs_delta = 0, 0, 0.0
    pendientes_current_month = 0

    if not metrics_data.empty:
        metrics = metrics_data.iloc[0]
        rechazadas_current_month = metrics.get('rechazadas_current_month', 0)
        rechazadas_prev_month = metrics.get('rechazadas_prev_month', 0)
        aprobadas_current_month = metrics.get('aprobadas_current_month', 0)
        aprobadas_prev_month = metrics.get('aprobadas_prev_month', 0)
        pendientes_current_month = metrics.get('pendientes_current_month', 0)
        
        total_ongs_current_month = aprobadas_current_month + rechazadas_current_month
        total_ongs_prev_month = aprobadas_prev_month + rechazadas_prev_month

        def calculate_delta(current, previous):
            if previous == 0:
                return 100.0 if current > 0 else 0.0
            else:
                return ((current - previous) / previous) * 100

        rechazadas_delta = calculate_delta(rechazadas_current_month, rechazadas_prev_month)
        aprobadas_delta = calculate_delta(aprobadas_current_month, aprobadas_prev_month)
        total_ongs_delta = calculate_delta(total_ongs_current_month, total_ongs_prev_month)
    else:
        print("No se pudieron cargar los datos de las métricas")

    query_validaciones_mes = f"""
    SELECT
        EXTRACT(MONTH FROM fecha_validacion)::INT as mes_num,
        estado_validacion as resultado,
        COUNT(*)::BIGINT as count
    FROM public.validaciones
    WHERE EXTRACT(YEAR FROM fecha_validacion) = {año_actual}
    AND estado_validacion IN ('Validada', 'Rechazada')
    GROUP BY 1, 2
    ORDER BY 1, 2
    """
    df_validaciones_por_mes_raw = fetch_table(query_validaciones_mes)

    df_validaciones_por_mes = pd.DataFrame(columns=['Mes', 'Validada', 'Rechazada'])
    if not df_validaciones_por_mes_raw.empty:
        df_pivot = df_validaciones_por_mes_raw.pivot_table(index='mes_num', columns='resultado', values='count', fill_value=0)

        if 'Validada' not in df_pivot.columns:
            df_pivot['Validada'] = 0
        if 'Rechazada' not in df_pivot.columns:
            df_pivot['Rechazada'] = 0

        df_pivot = df_pivot[['Validada', 'Rechazada']]

        meses_es_abbr = {i: calendar.month_abbr[i].capitalize() for i in range(1, 13)}
        df_pivot.index = df_pivot.index.map(meses_es_abbr)

        current_month_num = hoy.month
        all_months_abbr = [meses_es_abbr[i] for i in range(1, current_month_num + 1)]

        df_full = pd.DataFrame(index=all_months_abbr, columns=['Validada', 'Rechazada']).fillna(0)
        df_full.update(df_pivot)
        df_validaciones_por_mes = df_full.reset_index().rename(columns={'index': 'Mes'}).infer_objects(copy=False)
    else:
        print("No se encontraron datos para 'Validaciones por Mes'")

    query_tendencia_semanal = f"""
    SELECT
        date_trunc('day', fecha_validacion)::DATE as dia,
        COUNT(*)::BIGINT as count
    FROM public.validaciones
    WHERE EXTRACT(MONTH FROM fecha_validacion) = EXTRACT(MONTH FROM '{timestamp_key}'::timestamp)
      AND EXTRACT(YEAR FROM fecha_validacion) = EXTRACT(YEAR FROM '{timestamp_key}'::timestamp)
    GROUP BY 1
    ORDER BY 1
    """
    df_tendencia_semanal_raw = fetch_table(query_tendencia_semanal)

    df_tendencia_semanal = pd.DataFrame(columns=['Fecha', 'Validaciones'])
    if not df_tendencia_semanal_raw.empty:
        df_tendencia_semanal = df_tendencia_semanal_raw.copy()
        df_tendencia_semanal['dia'] = pd.to_datetime(df_tendencia_semanal['dia'])

        current_month_start = hoy.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
        last_day_of_month = (current_month_start + pd.DateOffset(months=1) - timedelta(days=1)).day
        current_month_end = hoy.replace(day=last_day_of_month, hour=23, minute=59, second=59, microsecond=999999)

        full_date_range = pd.date_range(start=current_month_start, end=current_month_end, freq='D')
        full_df_month = pd.DataFrame({'dia': full_date_range})

        df_tendencia_semanal = pd.merge(full_df_month, df_tendencia_semanal, on='dia', how='left').fillna(0).infer_objects(copy=False)
        df_tendencia_semanal['Dia_Del_Mes'] = df_tendencia_semanal['dia'].dt.day
        df_tendencia_semanal = df_tendencia_semanal.rename(columns={'dia': 'Fecha', 'count': 'Validaciones'})
        df_tendencia_semanal = df_tendencia_semanal.sort_values('Fecha')
    else:
        print("No se encontraron datos para 'Tendencia Diaria'")

    query_ongs_region = f"""
    SELECT
        r.nombre as region_nombre,
        COUNT(o.id)::BIGINT as cantidad
    FROM public.ongs o
    JOIN public.region r ON o.region_id = r.id
    WHERE date_trunc('month', o.fecha_registro) = date_trunc('month', '{timestamp_key}'::timestamp)
    GROUP BY r.nombre
    ORDER BY COUNT(o.id) DESC
    """
    df_ongs_por_region_raw = fetch_table(query_ongs_region)

    df_ongs_por_region_sorted = pd.DataFrame(columns=['Región', 'Cantidad'])
    if not df_ongs_por_region_raw.empty:
        df_ongs_por_region = df_ongs_por_region_raw.rename(columns={'region_nombre': 'Región', 'cantidad': 'Cantidad'})
        df_ongs_por_region_sorted = df_ongs_por_region.sort_values(by='Cantidad', ascending=True)
    else:
        print("No se encontraron datos para 'ONGs por Región'")

    fig_validaciones_por_mes = go.Figure()
    if not df_validaciones_por_mes.empty:
        fig_validaciones_por_mes = go.Figure(
            data=[
                go.Bar(name='Aprobadas', x=df_validaciones_por_mes['Mes'], y=df_validaciones_por_mes['Validada'], marker_color=COLOR_APROBADO),
                go.Bar(name='Rechazadas', x=df_validaciones_por_mes['Mes'], y=df_validaciones_por_mes['Rechazada'], marker_color=COLOR_RECHAZADO)
            ],
            layout=go.Layout(
                barmode='group',
                title='Validaciones Aprobadas y Rechazadas por Mes',
                margin=dict(l=40, r=40, t=90, b=40),
                plot_bgcolor=COLOR_FONDO_CLARO,
                paper_bgcolor=COLOR_FONDO_CLARO,
                font={'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA}, 
                xaxis={
                    'title': 'Mes',
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'},
                    'categoryorder':'array',
                    'categoryarray': df_validaciones_por_mes['Mes'].tolist()
                },
                yaxis={
                    'title': 'Cantidad',
                    'gridcolor': '#e0e0e0',
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
                },
                legend={
                    'x': 0.5, 'y': 1.15, 'xanchor': 'center', 'orientation': 'h',
                    'bgcolor': 'rgba(0,0,0,0)', 'bordercolor': 'rgba(0,0,0,0)',
                    'font': {'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'color': COLOR_PRINCIPAL_TEXTO}
                },
                hovermode="x unified",
                title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
            )
        )
    else:
        fig_validaciones_por_mes = go.Figure(layout=go.Layout(
            title='Validaciones Aprobadas y Rechazadas por Mes<br>(Sin datos disponibles)',
            xaxis={'visible': False}, yaxis={'visible': False},
            annotations=[{'text': 'No hay datos para mostrar', 'xref': 'paper', 'yref': 'paper', 'showarrow': False, 'font': {'size': 16}}],
            plot_bgcolor=COLOR_FONDO_CLARO, paper_bgcolor=COLOR_FONDO_CLARO,
            font={'family': FONT_FAMILY_SECUNDARIA, 'color': COLOR_SECUNDARIO_TEXTO}, 
            title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
        ))

    fig_ongs_por_region = go.Figure()
    if not df_ongs_por_region_sorted.empty:
        colors = px.colors.qualitative.Dark24
        if len(colors) < len(df_ongs_por_region_sorted):
            colors = colors * (len(df_ongs_por_region_sorted) // len(colors) + 1)
        colors = colors[:len(df_ongs_por_region_sorted)]

        fig_ongs_por_region = go.Figure(
            data=[
                go.Bar(
                    x=df_ongs_por_region_sorted['Cantidad'],
                    y=df_ongs_por_region_sorted['Región'],
                    orientation='h',
                    marker=dict(
                        color=colors,
                        line=dict(color='#6c757d', width=1)
                    ),
                    text=df_ongs_por_region_sorted['Cantidad'],
                    textposition='outside',
                    textfont=dict(size=12, color=COLOR_PRINCIPAL_TEXTO, family=FONT_FAMILY_SECUNDARIA)
                )
            ],
            layout=go.Layout(
                title='Solicitudes de validación recibidas por Región (Mes Actual)',
                margin=dict(l=150, r=60, t=60, b=40),
                plot_bgcolor=COLOR_FONDO_CLARO,
                paper_bgcolor=COLOR_FONDO_CLARO,
                font={'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA}, 
                xaxis={
                    'title': 'Cantidad',
                    'showgrid': False,
                    'zeroline': False,
                    'visible': True,
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
                },
                yaxis={
                    'title': 'Región',
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'},
                    'categoryorder':'total ascending',
                    'automargin': True
                },
                showlegend=False,
                hovermode="y unified",
                title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
            )
        )
    else:
        fig_ongs_por_region = go.Figure(layout=go.Layout(
            title='Solicitudes de validación recibidas por Región (Mes Actual)<br>(Sin datos disponibles)',
            xaxis={'visible': False}, yaxis={'visible': False},
            annotations=[{'text': 'No hay datos para mostrar', 'xref': 'paper', 'yref': 'paper', 'showarrow': False, 'font': {'size': 16}}],
            plot_bgcolor=COLOR_FONDO_CLARO, paper_bgcolor=COLOR_FONDO_CLARO,
            font={'family': FONT_FAMILY_SECUNDARIA, 'color': COLOR_SECUNDARIO_TEXTO}, 
            title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
        ))

    fig_tendencia_semanal = go.Figure()
    if not df_tendencia_semanal.empty:
        fig_tendencia_semanal = go.Figure(
            data=[
                go.Scatter(
                    x=df_tendencia_semanal['Dia_Del_Mes'],
                    y=df_tendencia_semanal['Validaciones'],
                    mode='lines+markers',
                    line=dict(color=COLOR_AZUL_LINEA, width=4),
                    marker=dict(color=COLOR_AZUL_LINEA, size=10, symbol='circle',
                                 line=dict(width=2, color='DarkSlateGrey'))
                )
            ],
            layout=go.Layout(
                title=f'Tendencia Diaria de solicitudes de Validaciones ({mes_anio_actual})',
                margin=dict(l=40, r=40, t=60, b=40),
                plot_bgcolor=COLOR_FONDO_CLARO,
                paper_bgcolor=COLOR_FONDO_CLARO,
                font={'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA}, 
                xaxis={
                    'title': 'Día del Mes',
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'},
                    'dtick': 1,
                    'tickmode': 'linear'
                },
                yaxis={
                    'title': 'Cantidad de Validaciones',
                    'gridcolor': '#e0e0e0',
                    'tickfont': {'color': COLOR_SECUNDARIO_TEXTO, 'family': FONT_FAMILY_SECUNDARIA, 'size': 12, 'weight': 'bold'},
                    'title_font': {'family': FONT_FAMILY_PRINCIPAL, 'size': 14, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
                },
                showlegend=False,
                hovermode="x unified",
                title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
            )
        )
    else:
        fig_tendencia_semanal = go.Figure(layout=go.Layout(
            title=f'Tendencia Diaria de solicitudes de Validaciones ({mes_anio_actual})<br>(Sin datos disponibles)',
            xaxis={'visible': False}, yaxis={'visible': False},
            annotations=[{'text': 'No hay datos para mostrar', 'xref': 'paper', 'yref': 'paper', 'showarrow': False, 'font': {'size': 16}}],
            plot_bgcolor=COLOR_FONDO_CLARO, paper_bgcolor=COLOR_FONDO_CLARO,
            font={'family': FONT_FAMILY_SECUNDARIA, 'color': COLOR_SECUNDARIO_TEXTO}, 
            title_font={'family': FONT_FAMILY_PRINCIPAL, 'size': 18, 'color': COLOR_PRINCIPAL_TEXTO, 'weight': 'bold'}
        ))

    return (total_ongs_current_month, total_ongs_delta, aprobadas_current_month, aprobadas_delta,
            rechazadas_current_month, rechazadas_delta, pendientes_current_month,
            fig_validaciones_por_mes, fig_ongs_por_region, fig_tendencia_semanal, mes_anio_actual)

app.layout = dash_html.Div(style={'backgroundColor': COLOR_FONDO_GENERAL, 'fontFamily': FONT_FAMILY_PRINCIPAL, 'padding': '20px'}, children=[
    dash_html.Div(children=[
        dash_html.H1("Panel de Monitoreo de Solicitudes", style=DASHBOARD_TITLE_STYLE),
        dash_html.P("Informe rápido sobre el sistema de validaciones", style=DASHBOARD_SUBTITLE_STYLE)
    ]),

    dcc.Interval(
        id='interval-component',
        interval=10*1000,
        n_intervals=0
    ),

    dash_html.Div(id='dashboard-content', style={'padding': '0 10px'})
])

@app.callback(
    Output('dashboard-content', 'children'),
    Input('interval-component', 'n_intervals')
)
def update_dashboard_content(n_intervals):
    print(f"DEBUG_CALLBACK: Callback 'update_dashboard_content' activado con n_intervals={n_intervals}")
    
    cache_key = datetime.now().replace(second=0, microsecond=0)

    total_ongs_current_month, total_ongs_delta, aprobadas_current_month, aprobadas_delta, \
    rechazadas_current_month, rechazadas_delta, pendientes_current_month, \
    fig_validaciones_por_mes, fig_ongs_por_region, fig_tendencia_semanal, mes_anio_actual_from_cache = \
        get_dashboard_data_and_figures_cached(cache_key)

    def get_delta_style(delta_value):
        if delta_value is None:
            return {'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '12px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}
        elif delta_value > 0:
            return {'color': COLOR_APROBADO, 'fontSize': '12px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA, 'fontWeight': 'bold'}
        elif delta_value < 0:
            return {'color': COLOR_RECHAZADO, 'fontSize': '12px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA, 'fontWeight': 'bold'}
        else:
            return {'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '12px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}

    def format_delta_text(delta_value):
        if delta_value is None:
            return "N/A"
        elif delta_value > 0:
            return f"▲ {delta_value:.2f}%"
        elif delta_value < 0:
            return f"▼ {abs(delta_value):.2f}%"
        else:
            return "0.00%"

    graph_panel_style = {
        'padding': '15px',
        'backgroundColor': COLOR_FONDO_CLARO,
        'borderRadius': '10px',
        'boxShadow': '0 4px 12px rgba(0,0,0,0.08)',
        'marginBottom': '20px',
        'flexGrow': '1',
        'flexShrink': '1',
        'flexBasis': 'calc(50% - 20px)',
        'minHeight': '450px',
        'display': 'flex',
        'flexDirection': 'column'
    }

    graphs_container_style = {
        'display': 'flex',
        'flexWrap': 'wrap',
        'justifyContent': 'center',
        'gap': '20px',
        'width': '100%',
        'maxWidth': '1200px',
        'margin': '0 auto'
    }

    return dash_html.Div([
        dash_html.Div(style={'display': 'flex', 'flexWrap': 'wrap', 'justifyContent': 'space-around', 'padding': '0 10px', 'marginBottom': '20px'}, children=[
            dash_html.Div(style={**METRIC_CARD_STYLE, 'borderLeft': f'5px solid #007bff'}, children=[
                dash_html.P(f"ONGs Revisadas en {mes_anio_actual_from_cache}", style={'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '14px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}),
                dash_html.H2(str(total_ongs_current_month if total_ongs_current_month is not None else 'N/A'), style={'color': COLOR_PRINCIPAL_TEXTO, 'fontSize': '38px', 'margin': '10px 0', 'fontFamily': FONT_FAMILY_PRINCIPAL, 'fontWeight': 'bold'}),
                dash_html.P(format_delta_text(total_ongs_delta), style=get_delta_style(total_ongs_delta)),
                dash_html.Div('👥', style={'position': 'absolute', 'top': '20px', 'right': '20px', 'fontSize': '45px', 'opacity': '0.15'})
            ]),
            dash_html.Div(style={**METRIC_CARD_STYLE, 'borderLeft': f'5px solid {COLOR_APROBADO}'}, children=[
                dash_html.P(f"Aprobadas en {mes_anio_actual_from_cache}", style={'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '14px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}),
                dash_html.H2(str(aprobadas_current_month if aprobadas_current_month is not None else 'N/A'), style={'color': COLOR_APROBADO, 'fontSize': '38px', 'margin': '10px 0', 'fontFamily': FONT_FAMILY_PRINCIPAL, 'fontWeight': 'bold'}),
                dash_html.P(format_delta_text(aprobadas_delta), style=get_delta_style(aprobadas_delta)),
                dash_html.Div('✅', style={'position': 'absolute', 'top': '20px', 'right': '20px', 'fontSize': '45px', 'opacity': '0.15'})
            ]),
            dash_html.Div(style={**METRIC_CARD_STYLE, 'borderLeft': f'5px solid {COLOR_RECHAZADO}'}, children=[
                dash_html.P(f"Rechazadas en {mes_anio_actual_from_cache}", style={'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '14px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}),
                dash_html.H2(str(rechazadas_current_month if rechazadas_current_month is not None else 'N/A'), style={'color': COLOR_RECHAZADO, 'fontSize': '38px', 'margin': '10px 0', 'fontFamily': FONT_FAMILY_PRINCIPAL, 'fontWeight': 'bold'}),
                dash_html.P(format_delta_text(rechazadas_delta), style=get_delta_style(rechazadas_delta)),
                dash_html.Div('❌', style={'position': 'absolute', 'top': '20px', 'right': '20px', 'fontSize': '45px', 'opacity': '0.15'})
            ]),
            dash_html.Div(style={**METRIC_CARD_STYLE, 'borderLeft': f'5px solid {COLOR_PENDIENTE}'}, children=[
                dash_html.P("Pendientes (Mes Actual)", style={'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '14px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}),
                dash_html.H2(str(pendientes_current_month if pendientes_current_month is not None else 'N/A'), style={'color': COLOR_PENDIENTE, 'fontSize': '38px', 'margin': '10px 0', 'fontFamily': FONT_FAMILY_PRINCIPAL, 'fontWeight': 'bold'}),
                dash_html.P("Requieren atención", style={'color': COLOR_SECUNDARIO_TEXTO, 'fontSize': '12px', 'margin': '0', 'fontFamily': FONT_FAMILY_SECUNDARIA}),
                dash_html.Div('⏳', style={'position': 'absolute', 'top': '20px', 'right': '20px', 'fontSize': '45px', 'opacity': '0.15'})
            ]),
        ]),

        dash_html.Div(style=graphs_container_style, children=[
            dash_html.Div(dcc.Graph(figure=fig_validaciones_por_mes, config={'responsive': True, 'displayModeBar': False}),
                            className='dash-graph-item', style={**graph_panel_style, 'flexBasis': 'calc(65% - 20px)', 'minWidth': '500px'}),
            dash_html.Div(dcc.Graph(figure=fig_ongs_por_region, config={'responsive': True, 'displayModeBar': False}),
                            className='dash-graph-item', style={**graph_panel_style, 'flexBasis': 'calc(35% - 20px)', 'minWidth': '300px'}),
        ]),

        dash_html.Div(style=graphs_container_style, children=[
            dash_html.Div(dcc.Graph(figure=fig_tendencia_semanal, config={'responsive': True, 'displayModeBar': False}),
                            className='dash-graph-item', style={**graph_panel_style, 'flexBasis': 'calc(100% - 20px)', 'minWidth': '700px'}),
        ]),
    ])

INDEX_HTML = """
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Dashboard de Estadísticas - ONGs</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Open+Sans&display=swap" rel="stylesheet">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Open Sans', sans-serif;
      background: #f8f9fa;
      color: #212529;
    }
    h1 {
        text-align: center;
        margin-top: 20px;
        color: #212529;
        font-family: 'Roboto', sans-serif;
        font-weight: 700;
    }
    iframe {
      width: 100%;
      height: 90vh;
      border: none;
      box-shadow: 0 5px 20px rgba(0,0,0,0.1);
      border-radius: 12px;
    }
    .main-container {
      max-width: 1280px;
      margin: 20px auto;
      padding: 0 25px;
    }

    ._dash-app-content {
        display: flex;
        flex-direction: column;
    }
    .dash-graph-item ._dash-graph {
        height: 100% !important;
        width: 100% !important;
    }
    .dash-graph-item {
        box-sizing: border-box;
    }
    .metric-value {
        font-family: 'Roboto', sans-serif;
        font-weight: bold;
    }

    @media (max-width: 992px) {
        .main-container {
            padding: 0 15px;
            max-width: 100%;
        }
        .dash-graph-item {
            flex-basis: 100% !important;
            min-width: unset !important;
        }
    }
    @media (max-width: 576px) {
        body {
            font-size: 14px;
        }
        h1 {
            font-size: 2em;
        }
        .main-container {
            padding: 0 10px;
        }
        .modebar {
            display: none !important;
        }
        .metric-card {
            min-width: 95% !important;
        }
    }
  </style>
</head>
<body>
  <div class="main-container">
    <h1>Panel de Monitoreo de Solicitudes</h1>
    <iframe src="/dashboard/"></iframe>
  </div>
</body>
</html>
"""

@server.route('/')
def index():
    return render_template_string(INDEX_HTML)

if __name__ == '__main__':
    import atexit
    if db_pool:
        atexit.register(db_pool.closeall) 
    server.run(debug=True, port=8050)