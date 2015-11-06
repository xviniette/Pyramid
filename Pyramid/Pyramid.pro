#-------------------------------------------------
#
# Project created by QtCreator 2015-11-04T12:12:14
#
#-------------------------------------------------

QT       += core gui

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

TARGET = Pyramid
TEMPLATE = app


SOURCES += main.cpp\
        mainwindow.cpp \
    player.cpp \
    map.cpp \
    bloc.cpp \
    game.cpp \
    inputs.cpp

HEADERS  += mainwindow.h \
    player.h \
    map.h \
    bloc.h \
    game.h \
    inputs.h

FORMS    += mainwindow.ui
