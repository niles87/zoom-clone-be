import * as io from "socket.io";
import express from "express";
import http from "http";

export default class VideoServer {
  public server: http.Server;
  private ws: io.Server;
  private user: any;
  private roomSocket: any;

  constructor(server: http.Server) {
    this.server = server;
    this.ws = new io.Server(this.server);
    this.user = {};

    this.roomSocket = {};
  }

  init(): void {
    this.ws.on("connection", (socket: io.Socket) => {
      socket.on("joining room", (roomId) => {
        if (this.user[roomId]) {
          this.user[roomId].push(socket.id);
        } else {
          this.user[roomId] = [socket.id];
        }
        this.roomSocket[socket.id] = roomId;

        const peopleInRoom = this.user[roomId].filter(
          (id: string) => id !== socket.id
        );
        console.log("joining room ", roomId);
        socket.emit("all users", peopleInRoom);
      });

      socket.on("sending signal", (payload) => {
        this.ws.to(payload.userToSignal).emit("user joined", {
          signal: payload.signal,
          callerID: payload.callerID,
        });
        console.log("sending signal ", payload.userToSignal);
      });

      socket.on("returning signal", (payload) => {
        this.ws.to(payload.callerID).emit("receiving signal", {
          signal: payload.signal,
          id: socket.id,
        });
        console.log("returning signal ", payload.callerID);
      });

      socket.on("disconnect", () => {
        const roomId = this.roomSocket[socket.id];
        let room = this.user[roomId];
        if (room) {
          room = room.filter((id: string) => id !== socket.id);
          this.user[roomId] = room;
        }
        socket.broadcast.emit("user disconnect", socket.id);
      });
    });
  }
}
