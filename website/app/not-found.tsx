"use client"

import {useEffect, useState} from "react";

const sprueche = [
    '42 ist die Antwort und TUDO ist die Frage',
    'Wahrscheinlich ist die Espressomaschine explodiert und hat deine gesuchte Seite in die Luft gejagt',
    'Vielleicht können wir dir ein leckeres Bierchen als Trost anbieten',
    'Vielleicht können wir dir eine Mate als Trost anbieten',
    'Vielleicht können wir dir eine Spezi als Trost anbieten',
    'Holz sieht sehr schön aus, Holz ist vielseitig. Besuche doch mal unsere Holzwerkstatt, diese existiert wenigstens',
    'When I\'m in a broken 3D-Printer competition and my opponent is TU-DO Makerspace',
    'Alles vor dem ersten Kaffee ist Notwehr',
    '26.04.2024 EB Party Kellerrave',
    'Dass diese Seite nicht existiert mag dir zwar stinken aber nicht so sehr wie unser Seminarraum',
    'Kaffee dehydriert den Körper nicht. Ich wäre sonst schon Staub.” -(Franz Kafka)',
    'Reparieren ist nachhaltiger als neu kaufen',
];


export default function NotFound(){


    const [zufallswert, setZufallswert] = useState(0);

    useEffect(() => {
        setZufallswert(Math.floor(Math.random() * sprueche.length));
    }, []);

    return (<>

            <div className="h-screen flex items-center justify-center ">
                <p className="text-4xl font-bold text-center text-gray-800"> 404 wir können leider nichts dazu finden! <br/>{sprueche[zufallswert]}</p>

            </div>
        </>

    )
}