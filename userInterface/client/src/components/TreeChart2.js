import React, { useRef, useEffect } from "react";
import { select, hierarchy, tree, linkHorizontal } from "d3";
import useResizeObserver from "./useResizeObserver";
import classes from "./TreeChart2.module.css";

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

function TreeChart2({ data }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  // we save data to see if it changed
  const previouslyRenderedData = usePrevious(data);

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);

    // use dimensions from useResizeObserver,
    // but use getBoundingClientRect on initial render
    // (dimensions are null for the first render)
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // transform hierarchical data
    const root = hierarchy(data);
    const treeLayout = tree().size([height, width]);

    const linkGenerator = linkHorizontal()
      .x((link) => link.y + 175)
      .y((link) => link.x);

    // enrich hierarchical data with coordinates
    treeLayout(root);

    console.warn("descendants", root.descendants());
    console.warn("links", root.links());

    // nodes
    svg
      .selectAll(".node")
      .data(root.descendants())
      .join((enter) => enter.append("circle").attr("opacity", 0))
      .attr("class", "node")
      .attr("cx", (node) => node.y + 178)
      .attr("cy", (node) => node.x)
      .attr("r", 4)
      .style("fill", "white")
      .transition()
      .duration(4000)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);

    svg
      .append("svg:defs")
      .selectAll("marker")
      .data(["end"]) // Different link/path types can be defined here
      .enter()
      .append("svg:marker") // This section adds in the arrows
      .attr("id", String)
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 8)
      .attr("refY", -1.5)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("svg:path")
      .style("fill", "red")

      .attr("stroke", "red")
      .attr("d", "M0,-5L10,0L0,5")
      .transition()
      .duration(4000);

    // links
    const enteringAndUpdatingLinks = svg
      .selectAll(".link")
      .data(root.links())
      .join("path")
      .attr("marker-end", "url(#end)")
      .attr("class", "link")
      .attr("d", linkGenerator)
      .attr("stroke-dasharray", function () {
        const length = this.getTotalLength();
        return `${length} ${length}`;
      })
      .attr("stroke", "red")
      .attr("fill", "none")
      .attr("opacity", 1);

    if (data !== previouslyRenderedData) {
      enteringAndUpdatingLinks
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(4000)
        .delay((link) => link.source.depth * 500)
        .attr("stroke-dashoffset", 0);
    }

    // labels
    svg
      .selectAll(".label")
      .data(root.descendants())
      .join((enter) => enter.append("text").attr("opacity", 0))
      .attr("class", "label")
      .attr("x", (node) => node.y + 178)
      .attr("y", (node) => node.x - 12)
      .attr("text-anchor", "middle")
      .attr("font-size", 14)
      .text((node) => {
        if (node.data.precedence === undefined) {
          return `${node.data.resname}`;
        }
        return `(${node.data.precedence})<----${node.data.resname}`;
      })
      .style("fill", "white")
      .transition()
      .duration(4000)
      .delay((node) => node.depth * 300)
      .attr("opacity", 1);
  }, [data, dimensions, previouslyRenderedData]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef} className={classes.svg}></svg>
    </div>
  );
}

export default TreeChart2;
