#ifndef MAP_H
#define MAP_H

#include <QVector>
#include "bloc.h"
#include <QString>
#include <QMap>

class Map
{
public:
    Map();
private:
    QString nom;
    float startX, startY, startZ;
    QVector<Bloc> blocs;
    QMap<QString,int> temps;
};

#endif // MAP_H
