(window.webpackJsonp=window.webpackJsonp||[]).push([[420],{706:function(n,s,a){"use strict";a.r(s);var t=a(29),e=Object(t.a)({},(function(){var n=this,s=n.$createElement,a=n._self._c||s;return a("ContentSlotsDistributor",{attrs:{"slot-key":n.$parent.slotKey}},[a("h1",{attrs:{id:"injectorservice"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#injectorservice"}},[n._v("#")]),n._v(" InjectorService "),a("Badge",{attrs:{text:"Service",type:"service"}})],1),n._v(" "),a("section",{staticClass:"symbol-info"},[a("table",{staticClass:"is-full-width"},[a("tbody",[a("tr",[a("th",[n._v("Module")]),a("td",[a("div",{staticClass:"lang-typescript"},[a("span",{staticClass:"token keyword"},[n._v("import")]),n._v(" { InjectorService } "),a("span",{staticClass:"token keyword"},[n._v("from")]),n._v(" "),a("span",{staticClass:"token string"},[n._v('"@tsed/di"')])])])]),a("tr",[a("th",[n._v("Source")]),a("td",[a("a",{attrs:{href:"https://github.com/TypedProject/tsed/blob/v5.52.1/packages/di/src/services/InjectorService.ts#L0-L0"}},[n._v("/packages/di/src/services/InjectorService.ts")])])])])])]),n._v(" "),a("h2",{attrs:{id:"overview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#overview"}},[n._v("#")]),n._v(" Overview")]),n._v(" "),a("div",{staticClass:"language-typescript"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("class")]),n._v(" InjectorService "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("extends")]),n._v(" "),a("a",{pre:!0,attrs:{href:"/api/di/class/Container.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[n._v("Container")])]),n._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("{")]),n._v("\n    settings"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(":")]),n._v(" TsED."),a("a",{pre:!0,attrs:{href:"/api/di/decorators/Configuration.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[n._v("Configuration")])]),n._v(" & "),a("a",{pre:!0,attrs:{href:"/api/di/services/DIConfiguration.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[n._v("DIConfiguration")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n    logger"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(":")]),n._v(" "),a("a",{pre:!0,attrs:{href:"/api/di/interfaces/IDILogger.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[n._v("IDILogger")])]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n"),a("div",{pre:!0,attrs:{class:"language- extra-class"}},[a("pre",[a("code",[n._v('<span class="token keyword">constructor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>\nget <span class="token function">resolvers</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">import</span><span class="token punctuation">(</span>"../interfaces"<span class="token punctuation">)</span>.<a href="/api/di/interfaces/IDIResolver.html"><span class="token">IDIResolver</span></a><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\nget <span class="token function">scopes</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token punctuation">{</span>\n    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>\n<span class="token punctuation">}</span> & <span class="token punctuation">{</span>\n    <span class="token punctuation">[</span>key<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">]</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>\n<span class="token punctuation">}</span><span class="token punctuation">;</span>\n/**\n * Retrieve default scope for a given provider.\n * @param provider\n */\n<span class="token function">scopeOf</span><span class="token punctuation">(</span>provider<span class="token punctuation">:</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/ProviderScope.html"><span class="token">ProviderScope</span></a><span class="token punctuation">;</span>\n/**\n * Clone a provider <span class="token keyword">from</span> <a href="/api/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a> and the given token. forkProvider method build automatically the provider if the instance parameter ins\'t given.\n * @param token\n * @param instance\n */\n<span class="token function">forkProvider</span><span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> instance?<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a><span class="token punctuation">;</span>\n/**\n * Return a list of instance build by the injector.\n */\n<span class="token function">toArray</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>\n/**\n * <a href="/api/common/mvc/decorators/method/Get.html"><span class="token">Get</span></a> a service or factory already constructed <span class="token keyword">from</span> his symbol or <span class="token keyword">class</span>.\n *\n * #### <a href="/api/swagger/decorators/Example.html"><span class="token">Example</span></a>\n *\n * ```typescript\n * <span class="token keyword">import</span> <span class="token punctuation">{</span>InjectorService<span class="token punctuation">}</span> <span class="token keyword">from</span> "@tsed/common"<span class="token punctuation">;</span>\n * <span class="token keyword">import</span> MyService <span class="token keyword">from</span> "./services"<span class="token punctuation">;</span>\n *\n * <span class="token keyword">class</span> OtherService <span class="token punctuation">{</span>\n *      <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n *          <span class="token keyword">const</span> myService<span class="token punctuation"> = </span>injectorService.get&lt;MyService&gt;<span class="token punctuation">(</span>MyService<span class="token punctuation">)</span><span class="token punctuation">;</span>\n *      <span class="token punctuation">}</span>\n * <span class="token punctuation">}</span>\n * ```\n *\n * @param token The <span class="token keyword">class</span> or symbol registered in InjectorService.\n * @returns <span class="token punctuation">{</span><span class="token keyword">boolean</span><span class="token punctuation">}</span>\n */\nget&lt;T<span class="token punctuation"> = </span><span class="token keyword">any</span>&gt;<span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> T | undefined<span class="token punctuation">;</span>\n/**\n * The <span class="token function">has</span><span class="token punctuation">(</span><span class="token punctuation">)</span> method returns a <span class="token keyword">boolean</span> indicating whether an element with the specified key exists or not.\n * @returns <span class="token punctuation">{</span><span class="token keyword">boolean</span><span class="token punctuation">}</span>\n * @param token\n */\n<span class="token function">has</span><span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>\n/**\n * Invoke the <span class="token keyword">class</span> and inject all services that required by the <span class="token keyword">class</span> <span class="token keyword">constructor</span>.\n *\n * #### <a href="/api/swagger/decorators/Example.html"><span class="token">Example</span></a>\n *\n * ```typescript\n * <span class="token keyword">import</span> <span class="token punctuation">{</span>InjectorService<span class="token punctuation">}</span> <span class="token keyword">from</span> "@tsed/common"<span class="token punctuation">;</span>\n * <span class="token keyword">import</span> MyService <span class="token keyword">from</span> "./services"<span class="token punctuation">;</span>\n *\n * <span class="token keyword">class</span> OtherService <span class="token punctuation">{</span>\n *     <span class="token keyword">constructor</span><span class="token punctuation">(</span>injectorService<span class="token punctuation">:</span> InjectorService<span class="token punctuation">)</span> <span class="token punctuation">{</span>\n *          <span class="token keyword">const</span> myService<span class="token punctuation"> = </span>injectorService.invoke&lt;MyService&gt;<span class="token punctuation">(</span>MyService<span class="token punctuation">)</span><span class="token punctuation">;</span>\n *      <span class="token punctuation">}</span>\n *  <span class="token punctuation">}</span>\n * ```\n *\n * @param token The injectable <span class="token keyword">class</span> to invoke. Class parameters are injected according <span class="token keyword">constructor</span> signature.\n * @param locals  Optional object. If preset then <span class="token keyword">any</span> argument Class are read <span class="token keyword">from</span> this object first<span class="token punctuation">,</span> before the `InjectorService` is consulted.\n * @param options\n * @returns <span class="token punctuation">{</span>T<span class="token punctuation">}</span> The <span class="token keyword">class</span> constructed.\n */\ninvoke&lt;T&gt;<span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> locals?<span class="token punctuation">:</span> Map&lt;<a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt;<span class="token punctuation">,</span> options?<span class="token punctuation">:</span> Partial&lt;<a href="/api/testing/IInvokeOptions.html"><span class="token">IInvokeOptions</span></a>&lt;T&gt;&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> T<span class="token punctuation">;</span>\n/**\n * Build only providers which are asynchronous.\n */\n<span class="token function">loadAsync</span><span class="token punctuation">(</span>locals?<span class="token punctuation">:</span> <a href="/api/di/class/LocalsContainer.html"><span class="token">LocalsContainer</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt;<a href="/api/di/class/LocalsContainer.html"><span class="token">LocalsContainer</span></a>&lt;<span class="token keyword">any</span>&gt;&gt;<span class="token punctuation">;</span>\n<span class="token function">loadSync</span><span class="token punctuation">(</span>locals?<span class="token punctuation">:</span> <a href="/api/di/class/LocalsContainer.html"><span class="token">LocalsContainer</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/di/class/LocalsContainer.html"><span class="token">LocalsContainer</span></a>&lt;<span class="token keyword">any</span>&gt;<span class="token punctuation">;</span>\n/**\n * Build all providers <span class="token keyword">from</span> given container <span class="token punctuation">(</span>or <a href="/api/di/registries/GlobalProviders.html"><span class="token">GlobalProviders</span></a><span class="token punctuation">)</span> and emit `$onInit` event.\n *\n * @param container\n */\n<span class="token function">load</span><span class="token punctuation">(</span>container?<span class="token punctuation">:</span> Map&lt;<a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a>&lt;<span class="token keyword">any</span>&gt;&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> Promise&lt;<a href="/api/di/class/LocalsContainer.html"><span class="token">LocalsContainer</span></a>&lt;<span class="token keyword">any</span>&gt;&gt;<span class="token punctuation">;</span>\n/**\n * Load all configurations registered on providers\n */\n<span class="token function">resolveConfiguration</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param locals\n * @param options\n */\n<span class="token function">bindInjectableProperties</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map&lt;<a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt;<span class="token punctuation">,</span> options<span class="token punctuation">:</span> Partial&lt;<a href="/api/testing/IInvokeOptions.html"><span class="token">IInvokeOptions</span></a>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param <span class="token punctuation">{</span><span class="token keyword">string</span><span class="token punctuation">}</span> propertyKey\n */\n<span class="token function">bindMethod</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> propertyKey <span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/IInjectablePropertyService.html"><span class="token">IInjectablePropertyService</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param <span class="token punctuation">{</span><span class="token keyword">string</span><span class="token punctuation">}</span> propertyKey\n * @param <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span> useType\n * @param locals\n * @param options\n */\n<span class="token function">bindProperty</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> propertyKey<span class="token punctuation">,</span> useType <span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/IInjectablePropertyService.html"><span class="token">IInjectablePropertyService</span></a><span class="token punctuation">,</span> locals<span class="token punctuation">:</span> Map&lt;<a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">,</span> <span class="token keyword">any</span>&gt;<span class="token punctuation">,</span> options<span class="token punctuation">:</span> Partial&lt;<a href="/api/testing/IInvokeOptions.html"><span class="token">IInvokeOptions</span></a>&gt;<span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param <span class="token punctuation">{</span><span class="token keyword">string</span><span class="token punctuation">}</span> propertyKey\n * @param <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span> useType\n */\n<span class="token function">bindValue</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> propertyKey<span class="token punctuation">,</span> expression<span class="token punctuation">,</span> defaultValue <span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/IInjectablePropertyValue.html"><span class="token">IInjectablePropertyValue</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param <span class="token punctuation">{</span><span class="token keyword">string</span><span class="token punctuation">}</span> propertyKey\n * @param <span class="token punctuation">{</span><span class="token keyword">any</span><span class="token punctuation">}</span> useType\n */\n<span class="token function">bindConstant</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> propertyKey<span class="token punctuation">,</span> expression<span class="token punctuation">,</span> defaultValue <span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/IInjectablePropertyValue.html"><span class="token">IInjectablePropertyValue</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> PropertyDescriptor<span class="token punctuation">;</span>\n/**\n *\n * @param instance\n * @param propertyKey\n * @param useType\n * @param options\n */\n<span class="token function">bindInterceptor</span><span class="token punctuation">(</span>instance<span class="token punctuation">:</span> <span class="token keyword">any</span><span class="token punctuation">,</span> <span class="token punctuation">{</span> propertyKey<span class="token punctuation">,</span> useType<span class="token punctuation">,</span> options <span class="token punctuation">}</span><span class="token punctuation">:</span> <a href="/api/di/interfaces/IInjectablePropertyService.html"><span class="token">IInjectablePropertyService</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <span class="token keyword">void</span><span class="token punctuation">;</span>\n<span class="token keyword">protected</span> <span class="token function">ensureProvider</span><span class="token punctuation">(</span>token<span class="token punctuation">:</span> <a href="/api/di/interfaces/TokenProvider.html"><span class="token">TokenProvider</span></a><span class="token punctuation">)</span><span class="token punctuation">:</span> <a href="/api/di/class/Provider.html"><span class="token">Provider</span></a> | undefined<span class="token punctuation">;</span>\n/**\n * Invoke a <span class="token keyword">class</span> method and inject service.\n *\n * #### IInjectableMethod options\n *\n * * **target**<span class="token punctuation">:</span> Optional. The <span class="token keyword">class</span> instance.\n * * **methodName**<span class="token punctuation">:</span> `<span class="token keyword">string</span>` Optional. The method name.\n * * **designParamTypes**<span class="token punctuation">:</span> `<span class="token keyword">any</span><span class="token punctuation">[</span><span class="token punctuation">]</span>` Optional. List of injectable types.\n * * **locals**<span class="token punctuation">:</span> `Map&lt;Function<span class="token punctuation">,</span> <span class="token keyword">any</span>&gt;` Optional. If preset then <span class="token keyword">any</span> argument Class are read <span class="token keyword">from</span> this object first<span class="token punctuation">,</span> before the `InjectorService` is consulted.\n *\n * #### <a href="/api/swagger/decorators/Example.html"><span class="token">Example</span></a>\n *\n * @param target\n * @param locals\n * @param options\n * @<span class="token keyword">private</span>\n */\n\n/**\n * Create options to invoke a provider or <span class="token keyword">class</span>.\n * @param token\n * @param options\n */\n')])])]),a("p",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("}")])])])])]),a("p"),n._v(" "),a("h2",{attrs:{id:"description"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#description"}},[n._v("#")]),n._v(" Description")]),n._v(" "),a("div",{pre:!0},[a("p",[n._v("This service contain all services collected by "),a("code",[n._v("@Service")]),n._v(" or services declared manually with "),a("code",[n._v("InjectorService.factory()")]),n._v(" or "),a("code",[n._v("InjectorService.service()")]),n._v(".")]),n._v(" "),a("h3",{pre:!0,attrs:{id:"example"}},[a("a",{pre:!0,attrs:{class:"header-anchor",href:"#example"}},[n._v("#")]),n._v(" Example:")]),n._v(" "),a("div",{pre:!0,attrs:{class:"language-typescript line-numbers-mode"}},[a("pre",{pre:!0,attrs:{"v-pre":"",class:"language-typescript"}},[a("code",[a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("import")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("{")]),n._v("InjectorService"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("}")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("from")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[n._v('"@tsed/common"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[n._v('// Import the services (all services are decorated with @Service()";')]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("import")]),n._v(" MyService1 "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("from")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[n._v('"./services/service1"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("import")]),n._v(" MyService2 "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("from")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[n._v('"./services/service2"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("import")]),n._v(" MyService3 "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("from")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token string"}},[n._v('"./services/service3"')]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n\n"),a("span",{pre:!0,attrs:{class:"token comment"}},[n._v("// When all services is imported you can load InjectorService.")]),n._v("\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("const")]),n._v(" injector "),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("new")]),n._v(" "),a("span",{pre:!0,attrs:{class:"token class-name"}},[n._v("InjectorService")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(")")]),n._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("await")]),n._v(" injector"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(".")]),a("span",{pre:!0,attrs:{class:"token function"}},[n._v("load")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("(")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n\n"),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("const")]),n._v(" myService1 "),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("=")]),n._v(" injector"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(".")]),a("span",{pre:!0,attrs:{class:"token keyword"}},[n._v("get")]),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v("<")]),n._v("MyService1"),a("span",{pre:!0,attrs:{class:"token operator"}},[n._v(">")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v("(")]),n._v("MyServcice1"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(")")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[n._v(";")]),n._v("\n")])]),n._v(" "),a("div",{pre:!0,attrs:{class:"line-numbers-wrapper"}},[a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("1")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("2")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("3")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("4")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("5")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("6")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("7")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("8")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("9")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("10")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("11")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("12")]),a("br"),a("span",{pre:!0,attrs:{class:"line-number"}},[n._v("13")]),a("br")])]),a("blockquote",[a("p",[n._v("Note: "),a("code",[n._v("ServerLoader")]),n._v(" make this automatically when you use "),a("code",[n._v("ServerLoader.mount()")]),n._v(" method (or settings attributes) and load services and controllers during the starting server.")])])])])}),[],!1,null,null,null);s.default=e.exports}}]);