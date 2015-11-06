#ifndef GAME_H
#define GAME_H

#include <QTimer>

#include "player.h"
#include "bloc.h"
#include "map.h"
#include "game.h"

class Game
{
public:
    Game();
    static Game *getInstance();
    void update();
    bool start();

    static Game *instance;

    Player *player;
    Map *map;
    int fps;

    QMap<QString, int> keys;
};

#endif // GAME_H
