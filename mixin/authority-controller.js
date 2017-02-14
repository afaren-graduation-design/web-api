"use strict";

function authorityCtrl() {
  return [
    {
      originPath: [
        /^\/programs\/(.*)$/,
        /^\/messages\/(.*)$/
      ],
      role: [1, 9]
    }
  ]
}

module.exports = authorityCtrl;