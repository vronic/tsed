(window.webpackJsonp=window.webpackJsonp||[]).push([[600],{888:function(s,a,n){"use strict";n.r(a);var t=n(29),e=Object(t.a)({},(function(){var s=this,a=s.$createElement,n=s._self._c||a;return n("ContentSlotsDistributor",{attrs:{"slot-key":s.$parent.slotKey}},[n("h1",{attrs:{id:"openapimodelschemabuilder"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#openapimodelschemabuilder"}},[s._v("#")]),s._v(" OpenApiModelSchemaBuilder "),n("Badge",{attrs:{text:"Class",type:"class"}})],1),s._v(" "),n("section",{staticClass:"symbol-info"},[n("table",{staticClass:"is-full-width"},[n("tbody",[n("tr",[n("th",[s._v("Module")]),n("td",[n("div",{staticClass:"lang-typescript"},[n("span",{staticClass:"token keyword"},[s._v("import")]),s._v(" { OpenApiModelSchemaBuilder } "),n("span",{staticClass:"token keyword"},[s._v("from")]),s._v(" "),n("span",{staticClass:"token string"},[s._v('"@tsed/swagger/src/class/OpenApiModelSchemaBuilder"')])])])]),n("tr",[n("th",[s._v("Source")]),n("td",[n("a",{attrs:{href:"https://github.com/TypedProject/tsed/blob/v5.52.1/packages/swagger/src/class/OpenApiModelSchemaBuilder.ts#L0-L0"}},[s._v("/packages/swagger/src/class/OpenApiModelSchemaBuilder.ts")])])])])])]),s._v(" "),n("h2",{attrs:{id:"overview"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#overview"}},[s._v("#")]),s._v(" Overview")]),s._v(" "),n("div",{staticClass:"language-typescript"},[n("pre",{pre:!0,attrs:{class:"language-typescript"}},[n("code",{pre:!0,attrs:{class:"typescript-lang "}},[n("span",{pre:!0,attrs:{class:"token keyword"}},[s._v("class")]),s._v(" OpenApiModelSchemaBuilder "),n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("{")]),s._v("\n"),n("div",{pre:!0,attrs:{class:"language- extra-class"}},[n("pre",[n("code",[s._v('<span class="token keyword">protected</span> _definitions<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>\n<span class="token keyword">protected</span> _responses<span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>\n<span class="token keyword">protected</span> _schema<span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>\n<span class="token keyword">constructor</span><span class="token punctuation">(</span>target<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">)</span><span class="token punctuation">;</span>\nget <span class="token function">schema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>\nget <span class="token function">definitions</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiDefinitions.html"><span class="token">OpenApiDefinitions</span></a><span class="token punctuation">;</span>\nget <span class="token function">responses</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/swagger/interfaces/OpenApiResponses.html"><span class="token">OpenApiResponses</span></a><span class="token punctuation">;</span>\n/**\n * Build the <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a> and his properties.\n * @returns <span class="token punctuation">{</span>OpenApiModelSchemaBuilder<span class="token punctuation">}</span>\n */\n<span class="token function">build</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> this<span class="token punctuation">;</span>\n/**\n *\n * @param <span class="token punctuation">{</span><a href="/api/core/class/Storable.html"><span class="token">Storable</span></a><span class="token punctuation">}</span> model\n * @returns <span class="token punctuation">{</span><a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">}</span>\n */\n<span class="token keyword">protected</span> <span class="token function">createSchema</span><span class="token punctuation">(</span><span class="token punctuation">{</span> schema<span class="token punctuation">,</span> type<span class="token punctuation">,</span> collectionType <span class="token punctuation">}</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    schema<span class="token punctuation">:</span> Partial&lt;<a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a>&gt;<span class="token punctuation">;</span>\n    type<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">;</span>\n    collectionType<span class="token punctuation">:</span> <a href="/api/core/interfaces/Type.html"><span class="token">Type</span></a>&lt;<span class="token keyword">any</span>&gt; | undefined<span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>\n/**\n * Return the stored <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a> of the <span class="token keyword">class</span> if exists. Otherwise<span class="token punctuation">,</span> return an empty <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a>.\n * @returns <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span>\n */\n<span class="token keyword">protected</span> <span class="token function">getClassSchema</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/mongoose/decorators/Schema.html"><span class="token">Schema</span></a><span class="token punctuation">;</span>\n')])])]),n("p",[n("span",{pre:!0,attrs:{class:"token punctuation"}},[s._v("}")]),s._v("\n/**")]),s._v(" "),n("ul",[n("li",[s._v("@deprecated\n*/")])])])])]),s._v(" "),n("h2",{attrs:{id:"description"}},[n("a",{staticClass:"header-anchor",attrs:{href:"#description"}},[s._v("#")]),s._v(" Description")]),s._v(" "),n("div",{pre:!0},[n("p",[s._v("Build a Schema from a given Model.")])])])}),[],!1,null,null,null);a.default=e.exports}}]);