import React from "react"
import { Helmet } from "react-helmet"

export default function AdminPage() {
  return (
    <>
      <Helmet>
        <script src="https://cdn.jsdelivr.net/npm/decap-cms@^3.0.0/dist/decap-cms.js"></script>
      </Helmet>
      <div id="nc-root"></div>
    </>
  )
}


