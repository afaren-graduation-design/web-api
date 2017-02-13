"use strict";

function authorityCtrl() {
  return [
    {
      originPath: [
        /^\/programs\/(.*)$/,
        /^\/messages\/(.*)$/
      ],
      role: [9]
    }
  ]
}

module.exports = authorityCtrl;