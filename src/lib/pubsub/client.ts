import { dev } from '$app/env'
import client from '$lib/db/socket.io-client'
import * as stores from './model-client'
import { live } from '$lib/site'

client(dev ? 'http://:4002' : live.io, stores)

/*
--- a/package.json
+++ b/package.json
@@ -23,9 +23,9 @@
-    "make:image": "rsync -avz ../../giji/giji/app/images/portrate/ .static_build_output/images/portrate/",
-    "make:json:game": "rsync -avz ../../giji/giji/app/json/ src/lib/game/json/",
-    "make:json:site": "rsync -avz ../../giji/giji/config/json/ src/lib/site/json/",
+    "make:image": "rsync -avz ../giji/app/images/portrate/ .static_build_output/images/portrate/",
+    "make:json:game": "rsync -avz ../giji/app/json/ src/lib/game/json/",
+    "make:json:site": "rsync -avz ../giji/config/json/ src/lib/site/json/",
 */
