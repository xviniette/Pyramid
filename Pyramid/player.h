#ifndef PLAYER_H
#define PLAYER_H

#include "bloc.h"
#include <QMap>
#include <QString>


class Player
{
public:
    Player();
    void setPosition(float x, float y, float z);
    void update();
    bool hasCollision(Bloc b);

    float x, y, z, dirX, dirY, width, height, depth, gravity, jump, speed, velX, velY, velZ;
    QString pseudo;
    QMap<QString, bool> inputs;
};

#endif // PLAYER_H
