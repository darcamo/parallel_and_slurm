"use strict";

function configure_mathjax () {
    window.MathJax = {
        AuthorInit: function () {

            MathJax.Hub.Register.StartupHook("TeX Jax Ready",function () {
                var TEX = MathJax.InputJax.TeX;

                // New Operators
                TEX.Macro("diag", "{\\mathop{\\rm diag}\\nolimits}");
                TEX.Macro("rank", "{\\mathop{\\rm rank}\\nolimits}");

                // Matrices
                TEX.Macro("mat","\\mathbf{#1}", 1);
                TEX.Macro("mtA","\\mathbf{A}");
                TEX.Macro("mtB","\\mathbf{B}");
                TEX.Macro("mtC","\\mathbf{C}");
                TEX.Macro("mtD","\\mathbf{D}");
                TEX.Macro("mtE","\\mathbf{E}");
                TEX.Macro("mtF","\\mathbf{F}");
                TEX.Macro("mtG","\\mathbf{G}");
                TEX.Macro("mtH","\\mathbf{H}");
                TEX.Macro("mtI","\\mathbf{I}");
                TEX.Macro("mtJ","\\mathbf{J}");
                TEX.Macro("mtK","\\mathbf{K}");
                TEX.Macro("mtL","\\mathbf{L}");
                TEX.Macro("mtM","\\mathbf{M}");
                TEX.Macro("mtN","\\mathbf{N}");
                TEX.Macro("mtO","\\mathbf{P}");
                TEX.Macro("mtP","\\mathbf{P}");
                TEX.Macro("mtQ","\\mathbf{Q}");
                TEX.Macro("mtR","\\mathbf{R}");
                TEX.Macro("mtS","\\mathbf{S}");
                TEX.Macro("mtT","\\mathbf{T}");
                TEX.Macro("mtU","\\mathbf{U}");
                TEX.Macro("mtV","\\mathbf{V}");
                TEX.Macro("mtW","\\mathbf{W}");
                TEX.Macro("mtX","\\mathbf{X}");
                TEX.Macro("mtY","\\mathbf{Y}");
                TEX.Macro("mtZ","\\mathbf{Z}");

                // Vectors
                TEX.Macro("Vt","\\mathbf{#1}", 1);
                TEX.Macro("vtA","\\mathbf{a}");
                TEX.Macro("vtB","\\mathbf{b}");
                TEX.Macro("vtC","\\mathbf{c}");
                TEX.Macro("vtD","\\mathbf{d}");
                TEX.Macro("vtE","\\mathbf{e}");
                TEX.Macro("vtF","\\mathbf{f}");
                TEX.Macro("vtG","\\mathbf{g}");
                TEX.Macro("vtH","\\mathbf{h}");
                TEX.Macro("vtI","\\mathbf{i}");
                TEX.Macro("vtJ","\\mathbf{j}");
                TEX.Macro("vtK","\\mathbf{k}");
                TEX.Macro("vtL","\\mathbf{l}");
                TEX.Macro("vtM","\\mathbf{m}");
                TEX.Macro("vtN","\\mathbf{n}");
                TEX.Macro("vtO","\\mathbf{p}");
                TEX.Macro("vtP","\\mathbf{p}");
                TEX.Macro("vtQ","\\mathbf{q}");
                TEX.Macro("vtR","\\mathbf{r}");
                TEX.Macro("vtS","\\mathbf{s}");
                TEX.Macro("vtT","\\mathbf{t}");
                TEX.Macro("vtU","\\mathbf{u}");
                TEX.Macro("vtV","\\mathbf{v}");
                TEX.Macro("vtW","\\mathbf{w}");
                TEX.Macro("vtX","\\mathbf{x}");
                TEX.Macro("vtY","\\mathbf{y}");
                TEX.Macro("vtZ","\\mathbf{z}");

                // Sets
                TEX.Macro("stA","\\mathcal{A}");
                TEX.Macro("stB","\\mathcal{B}");
                TEX.Macro("stC","\\mathcal{C}");
                TEX.Macro("stD","\\mathcal{D}");
                TEX.Macro("stE","\\mathcal{E}");
                TEX.Macro("stF","\\mathcal{F}");
                TEX.Macro("stG","\\mathcal{G}");
                TEX.Macro("stH","\\mathcal{H}");
                TEX.Macro("stI","\\mathcal{I}");
                TEX.Macro("stJ","\\mathcal{J}");
                TEX.Macro("stK","\\mathcal{K}");
                TEX.Macro("stL","\\mathcal{L}");
                TEX.Macro("stM","\\mathcal{M}");
                TEX.Macro("stN","\\mathcal{N}");
                TEX.Macro("stO","\\mathcal{P}");
                TEX.Macro("stP","\\mathcal{P}");
                TEX.Macro("stQ","\\mathcal{Q}");
                TEX.Macro("stR","\\mathcal{R}");
                TEX.Macro("stS","\\mathcal{S}");
                TEX.Macro("stT","\\mathcal{T}");
                TEX.Macro("stU","\\mathcal{U}");
                TEX.Macro("stV","\\mathcal{V}");
                TEX.Macro("stW","\\mathcal{W}");
                TEX.Macro("stX","\\mathcal{X}");
                TEX.Macro("stY","\\mathcal{Y}");
                TEX.Macro("stZ","\\mathcal{Z}");

                // Blackboard
                TEX.Macro("bbA","\\mathbb{A}");
                TEX.Macro("bbB","\\mathbb{B}");
                TEX.Macro("bbC","\\mathbb{C}");
                TEX.Macro("bbD","\\mathbb{D}");
                TEX.Macro("bbE","\\mathbb{E}");
                TEX.Macro("bbF","\\mathbb{F}");
                TEX.Macro("bbG","\\mathbb{G}");
                TEX.Macro("bbH","\\mathbb{H}");
                TEX.Macro("bbI","\\mathbb{I}");
                TEX.Macro("bbJ","\\mathbb{J}");
                TEX.Macro("bbK","\\mathbb{K}");
                TEX.Macro("bbL","\\mathbb{L}");
                TEX.Macro("bbM","\\mathbb{M}");
                TEX.Macro("bbN","\\mathbb{N}");
                TEX.Macro("bbO","\\mathbb{P}");
                TEX.Macro("bbP","\\mathbb{P}");
                TEX.Macro("bbQ","\\mathbb{Q}");
                TEX.Macro("bbR","\\mathbb{R}");
                TEX.Macro("bbS","\\mathbb{S}");
                TEX.Macro("bbT","\\mathbb{T}");
                TEX.Macro("bbU","\\mathbb{U}");
                TEX.Macro("bbV","\\mathbb{V}");
                TEX.Macro("bbW","\\mathbb{W}");
                TEX.Macro("bbX","\\mathbb{X}");
                TEX.Macro("bbY","\\mathbb{Y}");
                TEX.Macro("bbZ","\\mathbb{Z}");

                TEX.Macro("vtgamma","\\boldsymbol{\\gamma}");

                TEX.Macro("vtalpha", "\\boldsymbol{\\alpha}");
                TEX.Macro("vtbeta", "\\boldsymbol{\\beta}");
                TEX.Macro("vtrho", "\\boldsymbol{\\rho}");
                TEX.Macro("vtgamma", "\\boldsymbol{\\gamma}");
                TEX.Macro("vtAlpha", "\\boldsymbol{\\alpha}");
                TEX.Macro("vtEta", "\\boldsymbol{\\eta}");
                TEX.Macro("vtMu", "\\boldsymbol{\\mu}");
                TEX.Macro("vtNu", "\\boldsymbol{\\nu}");
                TEX.Macro("vtOne", "1");
                TEX.Macro("vtSigma", "\\boldsymbol{\\sigma}");
                TEX.Macro("vtTau", "\\boldsymbol{\\tau}");
                TEX.Macro("vtZero", "\\boldsymbol{0}");

                TEX.Macro("vtLambda", "\\boldsymbol{\\lambda}");

                // place macros here.  E.g.:
                //   TEX.Macro("R","{\\bf R}");
                //   TEX.Macro("op","\\mathop{\\rm #1}",1); // a macro with 1 parameter

            });
        }
    };
};


// This function must be called before MathJax is loaded
configure_mathjax ();
