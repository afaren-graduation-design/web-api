"use strict";

function authorityCtrl() {
  return [
    {
      originPath: [
        /^\/programs\/(.*)$/,
        /^\/messages\/(.*)$/
      ],
      role: [0, 1, 9]
    }
  ]
}

module.exports = authorityCtrl;