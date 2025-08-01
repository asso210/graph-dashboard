from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import networkx as nx
import os


app = FastAPI()

# Permetti CORS dal frontend (supponiamo sia localhost:3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simuliamo dati network per due filtri diversi
NETWORKS = {
    "network1": {
        "nodes": [{"id": 1}, {"id": 2}, {"id": 3}],
        "links": [{"source": 1, "target": 2}, {"source": 2, "target": 3}],
    },
    "network2": {
        "nodes": [{"id": "A"}, {"id": "B"}],
        "links": [{"source": "A", "target": "B"}],
    },
}

# @app.get("/graph")
# def get_graph():
#     try:
#         # Leggi il file .net con networkx
#         G = nx.read_pajek("path_al_tuo_file.net")

#         # NetworkX Pajek a volte crea MultiGraph, convertiamo in Graph semplice
#         if isinstance(G, nx.MultiGraph) or isinstance(G, nx.MultiDiGraph):
#             G = nx.Graph(G)

#         # Crea liste di nodi e archi per il frontend
#         nodes = [{"id": str(n)} for n in G.nodes()]
#         edges = [{"source": str(u), "target": str(v)} for u, v in G.edges()]

#         return {"nodes": nodes, "edges": edges}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


# @app.get("/graph")
# def get_graph():
#     try:
#         G = nx.Graph()
#         G.add_nodes_from(range(1, 13))
#         edges = [
#             (1, 2), (2, 3), (3, 4), (4, 5), (5, 6),
#             (6, 7), (7, 8), (8, 9), (9, 10), (10, 11),
#             (11, 12), (12, 1),
#             (1, 7), (2, 8), (3, 9), (4, 10), (5, 11), (6, 12)
#         ]
#         G.add_edges_from(edges)

#         # Layout circolare + SCALA
#         pos = nx.circular_layout(G)
#         scale = 300
#         nodes = [{"id": str(n), "fx": float(pos[n][0] * scale), "fy": float(pos[n][1] * scale)} for n in G.nodes()]
#         edges = [{"source": str(u), "target": str(v)} for u, v in G.edges()]

#         return {"nodes": nodes, "edges": edges}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))


DATA_DIR = "/data/networks"  # il volume Docker sarà montato qui

age_map = {
    0: "0_9", 1: "10_19", 2: "20_29", 3: "30_39",
    4: "40_49", 5: "50_59", 6: "60_69", 7: "70_79"
}

year_map = {
    0: "2003_2004", 1: "2005_2006", 2: "2007_2008",
    3: "2009_2010", 4: "2011_2012", 5: "2013_2014"
}

@app.get("/graph")
def get_graph(
    tipo_rete: str = Query(..., regex="^(BONF|FDR)$"),
    eta: int = Query(..., ge=0, le=7),
    anno: int = Query(..., ge=0, le=5),
    sesso: str = Query(..., regex="^(Male|Female)$")
):
    try:
        # Costruzione nome file
        eta_str = age_map[eta]
        anno_str = year_map[anno]
        file_name = f"ICD_ContingencyTables_{sesso}_{eta_str}_{anno_str}_{tipo_rete}.net"
        file_path = os.path.join(DATA_DIR, tipo_rete, file_name)

        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"File non trovato: {file_path}")

        G = nx.read_pajek(file_path)

        if isinstance(G, nx.MultiGraph) or isinstance(G, nx.MultiDiGraph):
            G = nx.Graph(G)

        nodes = [{"id": str(n)} for n in G.nodes()]
        edges = [{"source": str(u), "target": str(v)} for u, v in G.edges()]

        return {"nodes": nodes, "edges": edges}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
