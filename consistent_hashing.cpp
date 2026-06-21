#include<functional>
#include<iostream>
#include<vector>
#include<map>

using namespace std;

int M = 100;
map<size_t,string>ring;
map<string,vector<size_t>>location;

size_t getPosition(string serverName){
     hash<string>hasher;
     return hasher(serverName) % M;
}

void addServer(string serverName){
     size_t pos = getPosition(serverName);

     if(ring.find(pos) != ring.end()){
          for(int i=0;i<3;i++){
               string s = serverName + "-" + to_string(i);
               size_t pos = getPosition(s);
               if(ring.find(pos) == ring.end()){
                    ring[pos] = s;
                    location[serverName].push_back(pos);
                    return;
               }
          }
     }else{
          ring[pos] = serverName;
          location[serverName].push_back(pos);
     }
     return;
}

void removeServer(string serverName){
     if(location.find(serverName) == location.end()){
          cout<<"There's no server exist!";
          return;
     }

     int loc_len = location[serverName].size();

     for(int i=0;i<loc_len;i++){
          ring.erase(location[serverName][i]);
     }

     location.erase(serverName);

     return;
}

string routeRequest(string requestId){
     size_t pos = getPosition(requestId);
     auto it = ring.lower_bound(pos);

     if(it == ring.end()){
          return ring.begin()->second;
     }
     
     return it->second;
}

int main() {
    addServer("ServerA");
    addServer("ServerB");
    addServer("ServerC");

    cout << routeRequest("user1") << endl;
    cout << routeRequest("user2") << endl;

    removeServer("ServerB");

    cout << routeRequest("user1") << endl;
    cout << routeRequest("user2") << endl;

    return 0;
}