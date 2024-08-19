db.auth("map_store_admin", "2b0YlZxL79D");
db = db.getSiblingDB("map_store");
db.createUser({
  user: "map_store_db_owner",
  pwd: "i5u3h1PHb61",
  roles: [
    {
      role: "dbOwner",
      db: "map_store",
    },
  ],
});
db.createCollection("users");
