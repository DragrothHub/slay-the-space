import "./animationDetonator.css";

export default function AnimationDetonator({}){

    return (
        <div className="shield-break">

            {/* Energy shield */}
            <div className="shield-break__shield">
                <div className="shield-break__glow" />

                <div className="shield-break__crack crack-1" />
                <div className="shield-break__crack crack-2" />
                <div className="shield-break__crack crack-3" />
                <div className="shield-break__crack crack-4" />
                <div className="shield-break__crack crack-5" />
                <div className="shield-break__crack crack-6" />
            </div>

            {/* Impact */}
            <div className="shield-break__impact" />

            {/* Shards */}
            <div className="shield-break__shard shard-1" />
            <div className="shield-break__shard shard-2" />
            <div className="shield-break__shard shard-3" />
            <div className="shield-break__shard shard-4" />
            <div className="shield-break__shard shard-5" />
            <div className="shield-break__shard shard-6" />
            <div className="shield-break__shard shard-7" />
            <div className="shield-break__shard shard-8" />

        </div>
    );
}