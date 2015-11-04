#ifndef MAP_H
#define MAP_H

#include <QVector>
#include "bloc.h"

class Map
{
public:
    Map();
private:
    QString nom;
    float startX, startY, startZ;
    QVector<Bloc> blocs;
    QVector<int> temps;
};

#endif // MAP_H
