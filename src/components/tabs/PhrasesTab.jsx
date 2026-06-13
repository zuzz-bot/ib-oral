import {
  ChatCircle,
  ArrowsLeftRight,
  GlobeHemisphereWest,
  ListChecks,
  LinkSimple,
  Clock,
} from "@phosphor-icons/react";
import { PHRASES } from "../../data/phrases.js";

const ICONS = {
  ChatCircle,
  ArrowsLeftRight,
  GlobeHemisphereWest,
  ListChecks,
  LinkSimple,
  Clock,
};

export default function PhrasesTab({ accent }) {
  return (
    <>
      <p className="slbl">
        <ChatCircle size={12} weight="fill" /> Useful oral phrases — reach for these in any topic
      </p>
      {PHRASES.map((group, gi) => {
        const Icon = ICONS[group.icon] || ChatCircle;
        return (
          <div className="phrase-group au" style={{ "--i": gi }} key={group.group}>
            <div className="phrase-group-title">
              <Icon size={15} weight="fill" style={{ color: accent }} />
              {group.group}
            </div>
            <div className="phrase-chips">
              {group.items.map((p) => (
                <span className="phrase-chip" key={p}>
                  {p}
                </span>
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}
