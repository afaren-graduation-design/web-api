"use strict";

function authorityCtrl() {
  return [
    {
      originPath: [
        /^\/programs\/(.*)$/
      ],
      role: 9
    }
  ]
}

module.exports = authorityCtrl;