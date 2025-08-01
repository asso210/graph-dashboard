import React, { useEffect, useState } from "react";
import ForceGraph2D from "react-force-graph-2d";
import "./AnalyticsPage.css"; // Importa il file CSS

// Mappa colori RGB per i tipi di nodi
const coloriRGB = {
  A: "rgb(229,166,250)",
  B: "rgb(50,115,213)",
  C: "rgb(142,68,24)",
  D: "rgb(140,26,17)",
  E: "rgb(106,23,245)",
  F: "rgb(38,91,53)",
  G: "rgb(101,203,91)",
  H: "rgb(247,206,160)",
  I: "rgb(69,8,88)",
  J: "rgb(174,252,187)",
  K: "rgb(140,125,38)",
  L: "rgb(167,203,63)",
  M: "rgb(178,36,133)",
  N: "rgb(18,50,123)",
};

// Componente del loader (spinner)
const Loader = () => (
  <div className="loader-container">
    <div className="spinner"></div>
    <p>Caricamento grafo...</p>
  </div>
);

function AnalyticsPage() {
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [loading, setLoading] = useState(false);

  const [tipoRete, setTipoRete] = useState("BONF");
  const [eta, setEta] = useState(0);
  const [anno, setAnno] = useState(0);
  const [sesso, setSesso] = useState("Male");

  const fetchGraph = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        tipo_rete: tipoRete,
        eta: eta,
        anno: anno,
        sesso: sesso,
      });

      const res = await fetch(`http://localhost:8000/graph?${queryParams}`);
      const data = await res.json();

      const coloredNodes = data.nodes.map((node) => {
        const firstChar = node.id.charAt(0);
        return {
          ...node,
          color: coloriRGB[firstChar] || "gray",
        };
      });

      setGraphData({ nodes: coloredNodes, links: data.edges });
    } catch (err) {
      console.error("Errore nel caricamento del grafo:", err);
      setGraphData({ nodes: [], links: [] });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGraph();
  }, [tipoRete, eta, anno, sesso]);

  return (
    <div className="analytics-container">
      <h1 className="main-title">Visualizzazione Grafo ICD</h1>

      <div className="filters-container">
        <div className="filter-group">
          <label htmlFor="tipoRete">Tipo Rete</label>
          <select id="tipoRete" value={tipoRete} onChange={(e) => setTipoRete(e.target.value)}>
            <option value="BONF">BONF</option>
            <option value="FDR">FDR</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="eta">Età</label>
          <select id="eta" value={eta} onChange={(e) => setEta(Number(e.target.value))}>
            <option value={0}>0–10</option>
            <option value={1}>10–20</option>
            <option value={2}>20–30</option>
            <option value={3}>30–40</option>
            <option value={4}>40–50</option>
            <option value={5}>50–60</option>
            <option value={6}>60–70</option>
            <option value={7}>70–80</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="anno">Range Anni</label>
          <select id="anno" value={anno} onChange={(e) => setAnno(Number(e.target.value))}>
            <option value={0}>2003–2004</option>
            <option value={1}>2005–2006</option>
            <option value={2}>2007–2008</option>
            <option value={3}>2009–2010</option>
            <option value={4}>2011–2012</option>
            <option value={5}>2013–2014</option>
          </select>
        </div>

        <div className="filter-group">
          <label htmlFor="sesso">Sesso</label>
          <select id="sesso" value={sesso} onChange={(e) => setSesso(e.target.value)}>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      <div className="graph-container">
        {loading ? (
          <Loader />
        ) : (
          <ForceGraph2D
            graphData={graphData}
            nodeId="id"
            nodeLabel="id"
            nodeAutoColorBy={null}
            nodeColor={(node) => node.color}
            linkSource="source"
            linkTarget="target"
            backgroundColor="#F9FAFB" // Colore di sfondo più soft
            cooldownTicks={0}
            enableNodeDrag={false}
            nodeCanvasObjectMode={() => "after"}
            nodeCanvasObject={(node, ctx, globalScale) => {
              const label = node.id;
              const fontSize = 12 / globalScale;
              ctx.font = `${fontSize}px Sans-Serif`;
              ctx.fillStyle = node.color || "gray";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillText(label, node.x, node.y + 10);
            }}
          />
        )}
      </div>
    </div>
  );
}

export default AnalyticsPage;