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
    QMap<QString, float> getDeltaInBloc(Bloc b);

    float x, y, z, velX, velY, velZ, dirX, dirY, width, height, depth, gravity, maxGravity, jump, speed;
    QString pseudo;
    QMap<QString, bool> inputs;
};

#endif // PLAYER_H
